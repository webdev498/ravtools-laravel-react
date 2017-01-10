<?php

namespace App\Http\Helpers;

use App\Models\Api;

use \RavenTools\SiteAuditorData\RedisClient as RedisClient;
use \RavenTools\SiteAuditorData\CrawlSession as CrawlObject;
use App\Http\Helpers\CrawlHelper as CrawlHelper;
use App\Http\Helpers\StatHelper as StatHelper;

class SiteHelper
{
	private $redis_client = null;
	private $_site = null;

	public function __construct($site_object = null) {
		if (!is_null($site_object)) {
			$this->setSite($site_object);
		}
	}

	/**
	 * Getter for the RedisClient object
	 * 
	 * @return mixed
	 */
	public function getRedisClient($connection) {
		if (isset($this->redis_client)) {
			return $this->redis_client;
		}

		return RedisClient::get($connection);
	}

	public function getSite() {
		if (is_null($this->_site)) {
			return false;
		}

		return $this->_site;
	}

	public function setSite($site_object) {
		$this->_site  = $site_object;
	}

	public function format() {
		$site_object = $this->getSite();

		if ($site_object === false) {
			throw new \Exception('Can not format missing site object.');
		}

		$site = Api::transform($site_object);

		// if id isn't there, the array is either empty or invalid. return it as-is without any formatting.
		if (!array_key_exists('id', $site)) {
			return $site;
		}

		// Get Status
		$site['status'] = 'complete';
		if (array_key_exists('is_crawling', $site) && $site['is_crawling']) {
			$site['status'] = 'crawling';
		}

		// Infer Crawl Interval Setting and set it against the site
		$crawl_interval_setting = false;

		if (!empty($site['scheduled_ts'])) {
			if ($site['crawl_interval'] == 'weekly') {
				$crawl_interval_setting = strtolower(date('D', $site['scheduled_ts']));
			}
			elseif ($site['crawl_interval'] == 'monthly') {
				$crawl_interval_setting = date('j', $site['scheduled_ts']);
			}
		}

		$site['crawl_interval_setting'] = $crawl_interval_setting;

		// Get Crawls
		$crawl_object = new CrawlObject;

		$crawls = $crawl_object->find([
			'values' => [
				':site_id' => [
					'S' => $site['id']
				]
			],

			'conditions' => 'site_id = :site_id'
		]);

		$crawls = iterator_to_array($crawls);

		usort($crawls, function($a, $b) {
			return $a->complete_ts <= $b->complete_ts;
		});

		// Get Totals
		$latest_crawl = null;
		$previous_crawl = null;

		$site['total'] = [
			'pages' => 0,
			'issues' => 0
		];

		foreach($crawls as $crawl) {
			$crawl_helper = new CrawlHelper($crawl);
			$crawl = $crawl_helper->format();

			if (is_array($crawl) && array_key_exists('pages_crawled', $crawl)) {
				if (!array_key_exists('total_issues', $crawl)) {
					$crawl['total_issues'] = 0;
				}

				if (empty($latest_crawl)) {
					$latest_crawl = $crawl;

					$site['latest_crawl'] = $latest_crawl['id'];

					$site['total'] = [
						'pages' => (int) $latest_crawl['pages_crawled'],
						'issues' => (int) $latest_crawl['total_issues']
					];
					
					$site['screenshot'] = array_key_exists('screenshot_url', $latest_crawl) ? $latest_crawl['screenshot_url'] : '';
					$site['screenshot_thumb'] = array_key_exists('screenshot_thumb_url', $latest_crawl) ? $latest_crawl['screenshot_thumb_url'] : '';

					if (isset($latest_crawl['crawler_error']) && !is_null($latest_crawl['crawler_error'])) {
						$site['crawler_error'] = $latest_crawl['crawler_error'];
					}
				} else {
					$previous_crawl = $crawl;

					$site['previous_crawl'] = $previous_crawl['id'];

					$site['prev'] = [
						'pages' => (int) $previous_crawl['pages_crawled'],
						'issues' => (int) $previous_crawl['total_issues'],
					];

					if ( isset($latest_crawl['score']) && isset($previous_crawl['score']) ) {
						$site['prev']['change'] = $latest_crawl['score'] - $previous_crawl['score'];
					}
					else {
						$site['prev']['change'] = 0;
					}

					break;
				}	
			}
		}

		$site['score'] = null;

		if (!empty($latest_crawl)) {
			if ($site['total']['pages'] == 0) {
				$site['score'] = 0;
			}
			else {
				$site['score'] = $latest_crawl['score'];	
			}
		}

		$site['crawls'] = count($crawls);

		if (empty($previous_crawl)) {
			$site['prev'] = null;
		}

		if (!empty($site['is_crawling']) && !empty($site['current_session'])) {
			// ping redis for the current session's page count
			$cache = $this->getRedisClient('storage');

			$current_session_key = sprintf("%s_pages", $site['current_session']);

			$result = (int) $cache->get($current_session_key);

			$site['current_session_pages'] = $result;
		}

		return $site;
	}

	public static function calculateCrawlIntervalSetting($frequency, $day) {
		if ($frequency == 'weekly') {
			return strtotime("next {$day}");
		}
		elseif ($frequency == 'monthly') {
			$day = (int) $day - 1; // remove first day as its included
			return (new \DateTime('midnight first day of next month'))->modify("+{$day} days")->getTimestamp();
		}
		else {
			return false;
		}
	}
}
