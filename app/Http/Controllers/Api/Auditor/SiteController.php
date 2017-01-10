<?php

namespace App\Http\Controllers\Api\Auditor;

use App\Http\Controllers\Api\AuditorController as AuditorController;
use Illuminate\Http\Request as Request;

use \RavenTools\SiteAuditorData\Site as SiteObject;
use \RavenTools\SiteAuditorData\CrawlSession as CrawlObject;
use \RavenTools\SiteAuditorData\IssueExclusion as IssueExclusion;
use \RavenTools\SiteAuditorData\Share as ShareObject;
use \RavenTools\SiteAuditorData\RedisClient as RedisClient;

use App\Models\Api;

use App\Http\Helpers\SiteHelper as SiteHelper;

use Log;

// for validating the response of a url when adding a site
use \GuzzleHttp\Client as Guzzleclient;

// for tracking redirects when enabling a site
use Psr\Http\Message\RequestInterface;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\UriInterface;

class SiteController extends AuditorController
{
	public function __construct(Request $request)
	{
		parent::__construct($request);
	}

	/**
	 * List of all sites in an account w/ some properties
	 *
	 * @param Request $request
	 * @return \Symfony\Component\HttpFoundation\Response
	 */
	public function getSites(Request $request)
	{
		$site_object = new SiteObject;

		// DynamoDB Generators have to be converted back to an array for use
		$rows = $site_object->find([
			'values' => [
				':account_id' => [
					'S' => $this->account_id
				]
			],

			'conditions' => 'account_id = :account_id'
		]);

		$rows = iterator_to_array($rows);

		$sites = [];
		
		// Get the columns and apply their values to an element on the resulting array
		$schema = $site_object->getSchema();
		
		foreach($rows as $row) {
			// if the row doesn't have an id, then it's not a site object anymore. skip it.
			if (!$row->id) {
				continue;
			}

			$site_helper = new SiteHelper($row);
			$site = $site_helper->format();
			
			$site['rel'] = [
				'site' => sprintf('/api/v1/auditor/sites/site/%s', $site['id']),
				'summary' => sprintf('/api/v1/auditor/sites/site/%s/summary', $site['id'])
			];
			
			$sites[] = $site;
		}
		
		// manipulate the data a little before we pass it to the response. get related data, etc.
		$data = array(
			'account_id' => $this->account_id,
			'total' => count($sites),
			'data' => $sites
		);

		return $this->response($data, 'sites', $request);
	}

	/**
	 * Properties of a single site item, including most recent crawl id
	 *
	 * @param Request $request
	 * @return \Symfony\Component\HttpFoundation\Response
	 */
	public function getSite(Request $request)
	{
		$site_id = $this->getSiteId($request);

		// if not a string, an error response; return it
		if (!is_string($site_id)) {
			return $site_id;
		}

		$site_object = new SiteObject;
		
		$result = $site_object->get($site_id);
		
		if (!$result) {
			return $this->error(404, 'Object not found.');
		}

		$site_helper = new SiteHelper($site_object);
		$site = $site_helper->format();

		if (!empty($site['latest_crawl'])) {
			$site['rel'] = [
				'last_crawl' => sprintf('/api/v1/auditor/crawls/crawl/%s', $site['latest_crawl']),
				'path_exclusions' => sprintf('/api/v1/auditor/pathexclusions/?site_id=%s', $site['id'])
			];
		}

		return $this->response($site, 'site');
	}

	/**
	 * Update a site item's information
	 *
	 * @param Request $request
	 * @return \Symfony\Component\HttpFoundation\Response
	 */
	public function putSite(Request $request)
	{
		$site_id = $this->getSiteId($request);

		// if not a string, an error response; return it
		if (!is_string($site_id)) {
			return $site_id;
		}

		$site_object = new SiteObject;
		
		$result = $site_object->get($site_id);
		
		if (!$result) {
			return $this->error(404, 'Object not found.');
		}
		
		$data = $request->input();
		
		// nope
		unset($data['id']);
		unset($data['account_id']);
		
		$site_object->set($data);
		
		$result = $site_object->save();
		
		if ($result) {
			$item = Api::transform($site_object);

			return $this->response($item, 'site_put');
		} else {
			return $this->error();
		}
	}

	/**
	 * Create a new site item for a particular domain
	 *
	 * @param Request $request
	 * @return \Symfony\Component\HttpFoundation\Response
	 */
	public function postSite(Request $request)
	{
		$data = $request->input();

		// nope
		unset($data['id']);
		
		$data['account_id'] = $this->account_id;
		
		if (empty($data['crawl_interval'])) {
			$data['crawl_interval'] = 'manual';
		}

		if (!preg_match("/^https?:\/\//", $data['url'])) {
			$data['url'] = 'http://' . $data['url'];
		}

		$data['url'] = preg_replace("/\/$/", '', $data['url']);

		// validate the site URL
		$response = $this->getResponse($data['url']);

		if (empty($response)) {
			return $this->error(400, "We couldn't access {$data['url']}.");
		}

		if ($response['statusCode'] >= 400) {
			if ($response['statusCode'] == 403) {
				return $this->error(400, "We couldn't access that URL (received a 403 response). The server is likely blocking Amazon EC2.");
			}

			return $this->error(400, "We couldn't access that URL (received a {$response['statusCode']} response).");
		}

		if (isset($response['redirect_url'])) {
			// check for a https and/or www redirect (trailing slash included)

			// checkRedirect will return the original URL if no redirect was found
			$data['url'] = $this->checkRedirect($data['url'], $response['redirect_url']);
		}

		$defaults = [
			'complete_ts' => 0,
			'created_ts' => time(),
			'is_crawling' => 0,
			'max_urls' => 10000,
			'queue_ts' => 0,
			'scheduled_ts' => time() // make this shit run immediately!
		];

		$data = array_merge($data, $defaults);

		// Check for Existing Sites with that URL already in that Account
		$existing_object = new SiteObject;
		$existing = $existing_object->find([
			'values' => [
				':account_id' => [
					'S' => $this->account_id
				]
			],

			'conditions' => 'account_id = :account_id'
		]);

		$existing = iterator_to_array($existing);

		foreach($existing as $site) {
			if ($data['url'] == $site->url) {
				return $this->error(400, "A site with this URL already exists: {$data['url']}");
				break;
			}
		}

		$site_object = new SiteObject;

		$site_object->id = \Ramsey\Uuid\Uuid::Uuid4();
		$site_object->set($data);
		
		$result = $site_object->save();
		
		if ($result) {
			$site = Api::transform($site_object);

			return $this->response($site, 'site_post');
		} else {
			return $this->error();
		}
	}

	/**
	 * Gets a HTTP response object from a URL
	 * 
	 * @param String $url
	 * @return mixed `false` if the request fails completely, response object otherwise
	 */
	protected function getResponse($url) {
		$redirects = [];

		$redirect_callback = function(
			RequestInterface $request,
			ResponseInterface $response,
			UriInterface $uri
		) use (&$redirects) {
			$redirects[] = (string) $uri;
		};

		$client = new GuzzleClient([
			'timeout' => 10,
			'connect_timeout' => 5,
			'http_errors' => false,
			'allow_redirects' => [
				'max' => 10,
				'on_redirect' => $redirect_callback,
				'track_redirects' => true
			],
		]);

		// just use GET because a lot of servers hate HEAD (requests)
		try {
			$response = $client->request('GET', $url);
		} catch (\Exception $e) {
			return false;
		}

		$result = [
			'statusCode' => $response->getStatusCode(),
		];

		if (!empty($redirects)) {
			$result['redirect_url'] = end($redirects);
		}

		return $result;
	}

	protected function checkRedirect($url, $redirect_url) {
		// base case: both match
		if ($url == $redirect_url) {
			return $url;
		}

		$parsed = parse_url($url);
		$parsed_redirect = parse_url($redirect_url);

		// seriously malformed urls can return false from parse_url
		if ($parsed === false || $parsed_redirect === false) {
			return $url;
		}

		// RFC "absolute URI" standards require Location: headers to have a protocol and host
		if (empty($parsed_redirect['host'])) {
			return $this->error(400, "Invalid Redirect Location Header: {$redirect_url}");
		}

		// normalize trailing slashes
		if (isset($parsed['path'])) {
			$parsed['path'] = rtrim($parsed['path'], '/');
		} else {
			$parsed['path'] = null;
		}

		if (isset($parsed_redirect['path'])) {
			$parsed_redirect['path'] = rtrim($parsed_redirect['path'], '/');
		} else {
			$parsed_redirect['path'] = null;
		}

		// make sure the paths match - we don't want to assume they wanted to enter a different subdirectory on the site
		if ($parsed['path'] != $parsed_redirect['path']) {
			// nope
			return $url;
		}

		// make sure the parsed redirect url contains a protocol scheme, in the event `//somehost` was returned
		if (empty($parsed_redirect['scheme'])) {
			$parsed_redirect['scheme'] = 'http';
		}

		if ($parsed_redirect['scheme'] == 'https' && $parsed['host'] == $parsed_redirect['host'] && $parsed['path'] == $parsed_redirect['path']) {
			return rtrim($redirect_url, '/');
		}

		return $url;
	}

	/**
	 * Delete a site item
	 *
	 * @param Request $request
	 * @return \Symfony\Component\HttpFoundation\Response
	 */
	public function deleteSite(Request $request) {
		$site_id = $this->getSiteId($request);

		// if not a string, an error response; return it
		if (!is_string($site_id)) {
			return $site_id;
		}

		$site_object = new SiteObject;
		
		$result = $site_object->get($site_id);
		
		if (!$result) {
			return $this->error(404, 'Object not found.');
		}
		
		$crawl_object = new CrawlObject;

		$crawls = $crawl_object->find([
			'values' => [
				':site_id' => [
					'S' => $site_object->id
				]
			],

			'conditions' => 'site_id = :site_id'
		]);

		foreach($crawls as $crawl) {
			$crawl->delete();
		}

		$result = $site_object->delete();
		
		if ($result) {
			$response = [
				'deleted' => true
			];

			return $this->response($response, 'site_delete');
		} else {
			return $this->error();
		}
	}

	/**
	 * Summary stats from most recent crawl
	 *
	 * @param Request $request
	 * @param $section
	 * @return \Symfony\Component\HttpFoundation\Response
	 */
	public function getSummary(Request $request, $section = null)
	{
		$site_id = $this->getSiteId($request);

		// if not a string, an error response; return it
		if (!is_string($site_id)) {
			return $site_id;
		}

		$site_object = new SiteObject;
		
		$result = $site_object->get($site_id);
		
		if (empty($result)) {
			$this->error(404, 'Site record not found.');
		};

		$site_helper = new SiteHelper($site_object);
		$site = $site_helper->format();

		if (!array_key_exists('latest_crawl', $site) || empty($site['latest_crawl'])) {
			return $this->error(400, 'Site has not been crawled yet.');
		}

		$crawl_session_id = $site['latest_crawl'];

		$crawl_object = new CrawlObject;	
		$crawl_object->get($crawl_session_id);
		
		$total = [
			'pages' => (int) $crawl_object->pages_crawled,
			'issues' => (int) $crawl_object->total_issues
		];

		// map section totals to the stored keys
		$sections = [
			'visibility' => [
				'total' => 0,
				'stats' => [
					'errors' => [
						'total' => (int) $crawl_object->page_errors,
						'rel' => '#visibility/errors/' . $site_id
					],
					'blocked_by_robots' => [
						'total' => (int) $crawl_object->page_blocked_by_robots,
						'rel' => '#visibility/blocked_by_robots/' . $site_id
					],
					'malware' => [
						'total' => (int) $crawl_object->malware,
						'rel' => '#visibility/malware/' . $site_id
					],
					'redirects' => [
						'total' => (int) $crawl_object->page_redirects,
						'rel' => '#visibility/redirects/' . $site_id
					]
				]
			],
			'meta' => [
				'total' => 0,
				'stats' => [
					'missing_title' => [
						'total' => (int) $crawl_object->page_missing_title,
						'rel' => '#meta/missing_title/' . $site_id
					],
					'invalid_title' => [
						'total' => (int) $crawl_object->page_invalid_title,
						'rel' => '#meta/invalid_title/' . $site_id
					],
					'duplicate_title' => [
						'total' => (int) $crawl_object->duplicate_titles,
						'rel' => '#meta/duplicate_title/' . $site_id
					],
					'missing_description' => [
						'total' => (int) $crawl_object->page_missing_description,
						'rel' => '#meta/missing_description/' . $site_id
					],
					'invalid_description' => [
						'total' => (int) $crawl_object->page_invalid_description,
						'rel' => '#meta/invalid_description/' . $site_id
					],
					'duplicate_description' => [
						'total' => (int) $crawl_object->duplicate_descriptions,
						'rel' => '#meta/duplicate_description/' . $site_id
					],
					'missing_google_analytics' => [
						'total' => (int) $crawl_object->page_missing_google_analytics,
						'rel' => '#meta/missing_google_analytics/' . $site_id
					]
				]
			],
			'content' => [
				'total' => 0,
				'stats' => [
					'low_word_count' => [
						'total' => (int) $crawl_object->page_low_word_count,
						'rel' => '#content/low_word_count/' . $site_id
					],
					'duplicate_content' => [
						'total' => (int) $crawl_object->duplicate_content,
						'rel' => '#content/duplicate_content/' . $site_id
					]
				]
			],
			'links_internal' => [
				'total' => 0,
				'stats' => [
					'broken' => [
						'total' => (int) $crawl_object->link_internal_broken,
						'rel' => '#links_internal/broken/' . $site_id
					],
					'missing_anchor_or_alt' => [
						'total' => (int) $crawl_object->link_internal_missing_anchor_or_alt,
						'rel' => '#links_internal/missing_anchor_or_alt/' . $site_id
					],
					'nofollow' => [
						'total' => (int) $crawl_object->link_internal_nofollow,
						'rel' => '#links_internal/nofollow/' . $site_id
					]
				]
			],
			'links_external' => [
				'total' => 0,
				'stats' => [
					'broken' => [
						'total' => (int) $crawl_object->link_external_broken,
						'rel' => '#links_external/broken/' . $site_id
					],
					'missing_anchor_or_alt' => [
						'total' => (int) $crawl_object->link_external_missing_anchor_or_alt,
						'rel' => '#links_external/missing_anchor_or_alt/' . $site_id,
					],
					'nofollow' => [
						'total' => (int) $crawl_object->link_external_nofollow,
						'rel' => '#links_external/nofollow/' . $site_id
					]
				]
			],
			'images' => [
				'total' => 0,
				'stats' => [
					'broken' => [
						'total' => (int) $crawl_object->image_broken,
						'rel' => '#images/broken/' . $site_id
					],
					'missing_alt' => [
						'total' => (int) $crawl_object->image_missing_alt,
						'rel' => '#images/missing_alt/' . $site_id
					],
					'missing_title' => [
						'total' => (int) $crawl_object->image_missing_title,
						'rel' => '#images/missing_title/' . $site_id
					]
				]
			],
			'semantics' => [
				'total' => 0,
				'stats' => [
					'missing_headers' => [
						'total' => (int) $crawl_object->page_missing_headers,
						'rel' => '#semantics/missing_headers/' . $site_id,
					],
					'missing_schema_microdata' => [
						'total' => (int) $crawl_object->page_missing_schema_microdata,
						'rel' => '#semantics/missing_schema_microdata/' . $site_id
					]
				]
			]
		];

		$exclusion_object = new IssueExclusion;

		$exclusion_rows = $exclusion_object->find([
			'values' => [
				':site_id' => [
					'S' => $site_id
				]
			],

			'conditions' => 'site_id = :site_id'
		]);

		$exclusion_rows = iterator_to_array($exclusion_rows);
		$formatted_exclusions = [];

		if (count($exclusion_rows) > 0) {
			foreach ($exclusion_rows as $exclusion_row) {
				Log::info($exclusion_row->issue . ': ' . $exclusion_row->score_only);

				$issue_parts = explode('/', $exclusion_row->issue);

				if ($exclusion_row->score_only == 0) { // if it's not score only, exclude it from all the things
					unset($sections[$issue_parts[0]]['stats'][$issue_parts[1]]);
				}
				else { // else, it's score only so send along the exclusion to get handled by the summary
					$formatted_exclusions[] = $exclusion_row->issue;
				}
			}
		}

		foreach($sections as $error_section => $info) {
			foreach($info['stats'] as $type => $stat) {
				$sections[$error_section]['total'] += $stat['total'];
			}
		}

		if ($section) {
			$sections = $sections[$section];
		}

		$summary = array(
			'site' => $site,
			'total' => $total,
			'sections' => $sections,
			'score_exclusions' => $formatted_exclusions,
			'crawler_error' => $crawl_object->crawler_error
		);
		
		$data = array(
			'account_id' => $this->account_id,
			'site_id' => $site_id,
			'data' => $summary
		);

		return $this->response($data, 'summary');
	}

	/**
	 * Given a site_id, generate and return a site's share_hash
	 *
	 * @param Request $request
	 * @return \Symfony\Component\HttpFoundation\Response
	 */
	public function getSiteHash(Request $request) {
		$site_id = $this->getSiteId($request);
		$redirect_url = $request->input('redirect_url');

		// if not a string, an error response; return it
		if (!is_string($site_id)) {
			return $site_id;
		}

		$site_object = new SiteObject;
		$result = $site_object->get($site_id);

		if (!$result) {
			return $this->error(404, 'Object not found.');
		}

		$share_object = new ShareObject;

		$share_rows = [];

		if (!empty($redirect_url)) {
			$share_rows = $share_object->find([
				'values' => [
					':redirect_url' => [
						'S' => $redirect_url
					]
				],

				'conditions' => 'redirect_url = :redirect_url'
			]);

			$share_rows = iterator_to_array($share_rows);
		}

		// id should never be empty, but just in case
		if (count($share_rows) === 0 || !$share_rows[0]->id) {
			$hash = substr(md5($redirect_url), 0, 8);

			$share_object->id = $hash;
			$share_object->account_id = $this->account_id;
			$share_object->redirect_url = $redirect_url;
			$share_object->save();
		}
		else {
			$share_object = $share_rows[0];
		}

		$share = API::transform($share_object);

		return $this->response($share, 'sitehash');
	}

	/**
	 * Given a site_id, remove a share_hash from a matching site.
	 *
	 * @param $request
	 * @param $site_id
	 * @return \Symfony\Component\HttpFoundation\Response
	 */

	public function deleteSiteHash(Request $request) {
		$site_id = $this->getSiteId($request);
		$share_id = $request->input('share_id');

		// if not a string, an error response; return it
		if (!is_string($site_id)) {
			return $site_id;
		}

		$site_object = new SiteObject;
		$result = $site_object->get($site_id);

		if (!$result) {
			print_r('site object not found');
			return $this->error(404, 'Object not found.');
		}

		$share_object = new ShareObject;
		$share_object->get($share_id);

		if (!$share_object->id) {
			return $this->error(404, 'Object not found.');
		}

		$share_link = $share_object->redirect_url;

		$data = [
			'share_link' => $share_link
		];
		
		return $this->response($data, 'deletesitehash');
	}

	/**
	 * Given a share_hash, return a matching site
	 *
	 * @param $request
	 * @return \Symfony\Component\HttpFoundation\Response
	 */
	public function postSiteHash(Request $request) {
		$site_hash = $request->input('hash');

		$share_object = new ShareObject;
		$result = $share_object->get($site_hash);

		if (!$result) {
			return $this->error(404, 'Object not found.');
		}

		$data = array(
			'data' => [
				'account_id' => $share_object->account_id,
				'user_id' => $share_object->user_id,
				'redirect_url' => $share_object->redirect_url
			]
		);

		return $this->response($data, 'sitehash_post');
	}

	/**
	 * Sets the scheduled_ts for a Site based on posted settings.
	 *
	 * @param $request
	 * @return \Symfony\Component\HttpFoundation\Response
	 */

	public function runCrawl(Request $request) {
		$site_id = $this->getSiteId($request);

		$site_object = new SiteObject;
		$result = $site_object->get($site_id);

		if (!$result) {
			return $this->error(404, 'Object not found.');
		}

		$method = $request->input('method');

		if ($method == 'manually') {
			$input = new \SiteAuditorGrid\Input();
			$response = $input->queueWorkItem($site_object, true);
			if($response !== true) {
				return $this->error(400,"Re-Analyze failed.");
			}
		}
		else {
			$schedule_frequency = $request->input('schedule_frequency');

			if ($schedule_frequency == 'weekly' || $schedule_frequency == 'monthly') {
				$schedule_day = $request->input('schedule_day');
				$scheduled_ts = SiteHelper::calculateCrawlIntervalSetting($schedule_frequency, $schedule_day);
			}
			else {
				$schedule_frequency = 'manual';
				$scheduled_ts = null;
			}

			$site_object->set([
				'crawl_interval' => $schedule_frequency,
				'scheduled_ts' => $scheduled_ts
			]);

			$site_object->save();
		}

		$site = API::transform($site_object);

		return $this->response($site, 'runcrawl');
	}

	public function cancelCrawl(Request $request) {
		$site_id = $this->getSiteId($request);

		$site_object = new SiteObject;
		$result = $site_object->get($site_id);

		if (!$result) {
			return $this->error(404, 'Object not found.');
		}

		if (!empty($site_object->is_crawling) && !empty($site_object->current_session)) {
			$client = RedisClient::get('storage');

			$key = $site_object->current_session . '_state';

			$client->set($key, "paused");

			return response()->json([
				'result' => 'Crawl is being canceled.'
			]);
		}

		return response()->json([
			'result' => 'Site is not being crawled.'
		]);
	}

	/**
	 * Retrieves the site_id from a standard $request
	 * Could potentially be used in the future to determine if valid site_id or not.
	 *
	 * @param $request
	 * @return \Symfony\Component\HttpFoundation\Response
	 */
	protected function getSiteId($request) {
		$site_id = $request->input('site_id');

		// basic validation - TODO: make this better
		if (empty($site_id)) {
			return $this->error(400, 'Site ID is required.');
		}

		return $site_id;
	}
}
