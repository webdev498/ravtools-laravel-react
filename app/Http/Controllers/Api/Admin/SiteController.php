<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Api\AdminController as AdminController;
use Illuminate\Http\Request as Request;

use \RavenTools\SiteAuditorData\Account as AccountObject;
use \RavenTools\SiteAuditorData\Site as SiteObject;

use App\Http\Helpers\SiteHelper as SiteHelper;

class SiteController extends AdminController
{
	public function __construct(Request $request)
	{
		parent::__construct($request);
	}

	public function getSites(Request $request)
	{
		$site_object = new SiteObject;

		$rows = $site_object->find([
			'limit' => 1000
		]);

		$rows = iterator_to_array($rows);

		$sites = [];

		foreach($rows as $row) {
			if (!$row->id) {
				continue;
			}

			$site_helper = new SiteHelper($row);
			$site = $site_helper->format();

			$account_id = $site['account_id'];

			$account_object = new AccountObject;
			$result = $account_object->get($account_id);

			if ($result) {
				$site['account_name'] = $account_object->name;
			}
			else {
				$site['account_name'] = '';
			}

			$sites[] = $site;
		}

		$data = array(
			'total' => count($sites),
			'filtered' => count($sites),
			'records' => $sites
		);

		return $this->response($data, 'sites', $request);
	}

	public function getAccountSites($account_id, Request $request)
	{
		$site_object = new SiteObject;

		$rows = $site_object->find([
			'values' => [
				':account_id' => [
					'S' => $account_id
				]
			],

			'conditions' => 'account_id = :account_id'
		]);

		$rows = iterator_to_array($rows);

		$sites = [];

		foreach($rows as $row) {
			if (!$row->id) {
				continue;
			}

			$site_helper = new SiteHelper($row);
			$site = $site_helper->format();

			$sites[] = $site;
		}

		$data = array(
			'total' => count($sites),
			'filtered' => count($sites),
			'records' => $sites
		);

		return $this->response($data, 'account_sites', $request);
	}

	public function getSite(Request $request)
	{
		$site_id = $this->getRequestSiteId($request);

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

		if($site['account_id']) {
			$account_object = new AccountObject;
			$result = $account_object->get($site['account_id']);

			if ($result) {
				$site['account_name'] = $account_object->name;
			}
		}

		return $this->response($site, 'site', $request);
	}

	protected function getRequestSiteId($request) {
		$site_id = $request->input('site_id');

		if (empty($site_id)) {
			return $this->error(400, 'Site ID is required.');
		}

		return $site_id;
	}
}