<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Api\AdminController as AdminController;
use Illuminate\Http\Request as Request;

use \RavenTools\SiteAuditorData\Package as PackageObject;
use \RavenTools\SiteAuditorData\Feature as FeatureObject;
use \RavenTools\SiteAuditorData\PackageFeature as PackageFeatureObject;

use App\Models\Api as Api;

class PackageController extends AdminController
{
	public function __construct(Request $request)
	{
		parent::__construct($request);
	}

	public function getPackages(Request $request)
	{
		$package_object = new PackageObject;

		$rows = $package_object->find([
			'limit' => 1000
		]);

		$rows = iterator_to_array($rows);

		$packages = [];

		foreach($rows as $row) {
			$package = Api::transform($row);

			$packages[] = $package;
		}

		$data = array(
			'total' => count($packages),
			'filtered' => count($packages),
			'records' => $packages
		);

		return $this->response($data, 'packages', $request);
	}

	public function getPackage(Request $request)
	{
		$package_id = $this->getRequestPackageId($request);

		if (!is_string($package_id)) {
			return $package_id;
		}

		$package_object = new PackageObject;
		$result = $package_object->get($package_id);

		if (!$result) {
			return $this->error(404, 'Object not found.');
		}

		$package = Api::transform($package_object);

		return $this->response($package, 'package', $request);
	}

	public function getFeaturePackages($feature_id, Request $request) {
		$packagefeature_object = new PackageFeatureObject;

		$rows = $packagefeature_object->find([
			'values' => [
				':feature_id' => [
					'S' => $feature_id
				]
			],

			'conditions' => 'feature_id = :feature_id'
		]);

		$rows = iterator_to_array($rows);

		$packages = [];

		foreach($rows as $row) {
			if (!$row->id) {
				continue;
			}

			$package_object = new PackageObject;
			$result = $package_object->get($row->package_id);

			if ($result) {
				$package = Api::transform($package_object);

				$package['quantity'] = $row->quantity;

				$packages[] = $package;
			}
		}

		$data = array(
			'total' => count($packages),
			'filtered' => count($packages),
			'records' => $packages
		);

		return $this->response($data, 'feature_packages', $request);
	}

	protected function getRequestPackageId($request) {
		$package_id = $request->input('package_id');

		if (empty($package_id)) {
			return $this->error(400, 'Package ID is required.');
		}

		return $package_id;
	}
}