<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Api\AdminController as AdminController;
use Illuminate\Http\Request as Request;

use \RavenTools\SiteAuditorData\Account as AccountObject;
use \RavenTools\SiteAuditorData\Site as SiteObject;
use \RavenTools\SiteAuditorData\CrawlSession as CrawlObject;

use App\Http\Helpers\CrawlHelper as CrawlHelper;

class CrawlController extends AdminController
{
	public function __construct(Request $request)
	{
		parent::__construct($request);
	}

	public function getCrawls(Request $request)
	{
		$crawl_object = new CrawlObject;

		$rows = $crawl_object->find([
			'limit' => 1000
		]);

		$rows = iterator_to_array($rows);

		$crawls = [];

		foreach($rows as $row) {
			if (!$row->id) {
				continue;
			}

			$crawl_helper = new CrawlHelper($row);
			$crawl = $crawl_helper->format();

			$site_id = $crawl['site_id'];

			$site_object = new SiteObject;
			$result = $site_object->get($site_id);

			if ($result) {
				$crawl['site_url'] = $site_object->url;
			}
			else {
				$crawl['site_url'] = '';
			}

			$crawls[] = $crawl;
		}

		$data = array(
			'total' => count($crawls),
			'filtered' => count($crawls),
			'records' => $crawls
		);

		return $this->response($data, 'crawls', $request);
	}

	public function getAccountCrawls(Request $request)
	{
		return $this->response([], 'account_crawls', $request);
	}

	public function getSiteCrawls($site_id, Request $request)
	{
		$crawl_object = new CrawlObject;

		$rows = $crawl_object->find([
			'values' => [
				':site_id' => [
					'S' => $site_id
				]
			],

			'conditions' => 'site_id = :site_id'
		]);

		$rows = iterator_to_array($rows);

		$crawls = [];

		foreach($rows as $row) {
			if (!$row->id) {
				continue;
			}

			$crawl_helper = new CrawlHelper($row);
			$crawl = $crawl_helper->format();

			$crawls[] = $crawl;
		}

		$data = array(
			'total' => count($crawls),
			'filtered' => count($crawls),
			'records' => $crawls
		);

		return $this->response($data, 'site_crawls', $request);
	}

	public function getCrawl(Request $request)
	{
		$crawl_id = $this->getRequestCrawlId($request);

		if (!is_string($crawl_id)) {
			return $crawl_id;
		}

		$crawl_object = new CrawlObject;
		$result = $crawl_object->get($crawl_id);

		if (!$result) {
			return $this->error(404, 'Object not found.');
		}

		$crawl_helper = new CrawlHelper($crawl_object);
		$crawl = $crawl_helper->format();

		if ($crawl['site_id']) {
			$site_object = new SiteObject;
			$result = $site_object->get($crawl['site_id']);

			if ($result) {
				$crawl['site_url'] = $site_object->url;

				if ($site_object->account_id) {
					$account_object = new AccountObject;
					$result = $account_object->get($site_object->account_id);

					if ($result) {
						$crawl['account_id'] = $account_object->id;
						$crawl['account_name'] = $account_object->name;
					}
				}
			}
		}

		return $this->response($crawl, 'crawl', $request);
	}

	protected function getRequestCrawlId($request) {
		$crawl_id = $request->input('crawl_id');

		if (empty($crawl_id)) {
			return $this->error(400, 'Crawl ID is required.');
		}

		return $crawl_id;
	}
}