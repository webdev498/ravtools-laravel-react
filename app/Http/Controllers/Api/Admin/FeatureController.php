<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Api\AdminController as AdminController;
use Illuminate\Http\Request as Request;

use \RavenTools\SiteAuditorData\Package as PackageObject;
use \RavenTools\SiteAuditorData\Feature as FeatureObject;
use \RavenTools\SiteAuditorData\PackageFeature as PackageFeatureObject;

use App\Models\Api as Api;

class FeatureController extends AdminController
{
	public function __construct(Request $request)
	{
		parent::__construct($request);
	}

	public function getFeatures(Request $request)
	{
		$feature_object = new FeatureObject;

		$rows = $feature_object->find([
			'limit' => 1000
		]);

		$rows = iterator_to_array($rows);

		$features = [];

		foreach($rows as $row) {
			$feature = Api::transform($row);

			$features[] = $feature;
		}

		$data = array(
			'total' => count($features),
			'filtered' => count($features),
			'records' => $features
		);

		return $this->response($data, 'features', $request);
	}

	public function getPackageFeatures($package_id, Request $request)
	{
		$packagefeature_object = new PackageFeatureObject;

		$rows = $packagefeature_object->find([
			'values' => [
				':package_id' => [
					'S' => $package_id
				]
			],

			'conditions' => 'package_id = :package_id'
		]);

		$rows = iterator_to_array($rows);

		$features = [];

		foreach($rows as $row) {
			if (!$row->id) {
				continue;
			}

			$feature_object = new FeatureObject;
			$result = $feature_object->get($row->feature_id);

			if ($result) {
				$feature = Api::transform($feature_object);

				$feature['quantity'] = $row->quantity;

				$features[] = $feature;
			}
		}

		$data = array(
			'total' => count($features),
			'filtered' => count($features),
			'records' => $features
		);

		return $this->response($data, 'package_features', $request);
	}

	public function getFeature(Request $request)
	{
		$feature_id = $this->getRequestFeatureId($request);

		if (!is_string($feature_id)) {
			return $feature_id;
		}

		$feature_object = new FeatureObject;
		$result = $feature_object->get($feature_id);

		if (!$result) {
			return $this->error(404, 'Object not found.');
		}

		$feature = Api::transform($feature_object);

		return $this->response($feature, 'feature', $request);
	}

	protected function getRequestFeatureId($request) {
		$feature_id = $request->input('feature_id');

		if (empty($feature_id)) {
			return $this->error(400, 'Feature ID is required.');
		}

		return $feature_id;
	}
}