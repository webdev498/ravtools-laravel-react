<?php

namespace App\Http\Controllers\Api\Auditor;

use App\Http\Controllers\Api\AuditorController as AuditorController;
use Illuminate\Http\Request as Request;

use \RavenTools\SiteAuditorData\IssueExclusion;

use App\Models\Api;

class IssueExclusionController extends AuditorController
{
		public function __construct(Request $request)
	{
		parent::__construct($request);
	}

	/**
	 * Excluded URL paths that don't need to be crawled on a site
	 *
	 * @param Request $request
	 * @return \Symfony\Component\HttpFoundation\Response
	 */
	public function getExclusions(Request $request)
	{
		$site_id = $request->input('site_id');

		if (empty($site_id)) {
			return $this->error();
		}

		$object = new IssueExclusion;

		$rows = $object->find([
			'values' => [
				':site_id' => [
					'S' => $site_id
				]
			],

			'conditions' => 'site_id = :site_id'
		]);

		$rows = iterator_to_array($rows);
		
		$results = [];
		
		foreach($rows as $obj) {
			$result = Api::transform($obj);
			
			$results[] = $result;
		}
		
		$data = [
			'account_id' => $this->account_id,
			'site_id' => $site_id,
			'total' => count($results),
			'data' => $results
		];

		return $this->response($data, 'issueexclusions', $request);
	}

	/**
	 * Properties of a single exclusion item
	 *
	 * @param $id
	 * @return \Symfony\Component\HttpFoundation\Response
	 */
	public function getExclusion($id)
	{
		if (empty($id)) {
			return $this->error();
		}
		
		$object = new IssueExclusion;
		
		$result = $object->get($id);
		
		if (!$result) {
			return $this->error(404, 'Object not found.');
		}
		
		$data = Api::transform($object);

		return $this->response($data, 'issueexclusion');
	}

	/**
	 * Update an exclusion item's information
	 *
	 * @param Request $request
	 * @param $id
	 * @return \Symfony\Component\HttpFoundation\Response
	 */
	public function putExclusion(Request $request, $id)
	{
		$object = new IssueExclusion;
		
		$result = $object->get($id);
		
		if (!$result) {
			return $this->error(404, 'Object not found.');
		}
		
		$data = $request->input();
		
		// nope
		unset($data['id']);
		unset($data['site_id']);
		
		$object->set($data);
		
		$result = $object->save();
		
		if ($result) {
			$item = Api::transform($object);

			return $this->response($item, 'issueexclusion_put');
		} else {
			return $this->error();
		}
	}

	/**
	 * Create a new exclusion item for a particular site
	 *
	 * @param Request $request
	 * @return \Symfony\Component\HttpFoundation\Response
	 */
	public function postExclusion(Request $request)
	{
		$site_id = $request->input('site_id');
		
		$data = $request->input();
		
		// nope
		unset($data['id']);

		// basic validation - TODO: make this better
		if (empty($site_id)) {
			return $this->error(400, 'Site ID is required.');
		}

		if (!array_key_exists('score_only', $data)) {
			$data['score_only'] = 0;
		}
		
		$object = new IssueExclusion;
		
		$object->id = \Ramsey\Uuid\Uuid::Uuid4();
		$object->set($data);
		
		$result = $object->save();
		
		if ($result) {
			$data = Api::transform($object);

			return $this->response($data, 'issueexclusion_post');
		} else {
			return $this->error();
		}
	}

	/**
	 * Delete an exclusion item
	 *
	 * @param $id
	 * @return \Symfony\Component\HttpFoundation\Response
	 */
	public function deleteExclusion($id)
	{
		$object = new IssueExclusion;
		
		$result = $object->get($id);
		
		if (!$result) {
			return $this->error(404, 'Object not found.');
		}
		
		$result = $object->delete();
		
		if ($result) {
			$response = [
				'deleted' => true
			];

			return $this->response($response, 'issueexclusion_delete');
		} else {
			return $this->error();
		}
	}

	/**
	 * Delete an exclusion item given the site information and exclusion information provided
	 *
	 * @param $id
	 * @return \Symfony\Component\HttpFoundation\Response
	 */
	public function deleteExclusionFromSite(Request $request)
	{
		$site_id = $request->input('site_id');
		$issue = $request->input('issue');

		$object = new IssueExclusion;
		
		$existing_exclusions = $object->find([
			'values' => [
				':site_id' => [
					'S' => $site_id
				]
			],

			'conditions' => 'site_id = :site_id'
		]);

		$result = false;

		foreach ($existing_exclusions as $exclusion) {
			if ($exclusion->issue == $issue) {
				$result = $exclusion->delete();

				break;
			}
		}
		
		if (!$result) {
			return $this->error(404, 'Object not found.');
		}
		
		if ($result) {
			$response = [
				'deleted' => true
			];

			return $this->response($response, 'issueexclusion_delete');
		} else {
			return $this->error();
		}
	}
}