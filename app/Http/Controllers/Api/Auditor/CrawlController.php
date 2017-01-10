<?php

namespace App\Http\Controllers\Api\Auditor;

use App\Http\Controllers\Api\AuditorController as AuditorController;
use Illuminate\Http\Request as Request;

use \RavenTools\SiteAuditorData\CrawlSession as CrawlObject;
use App\Models\Api;

class CrawlController extends AuditorController
{
	public function __construct(Request $request)
	{
		parent::__construct($request);
	}

	/**
	 * List of all crawl sessions for a single site id w/ some properties
	 *
	 * @param Request $request
	 * @return \Symfony\Component\HttpFoundation\Response
	 */
	public function getCrawls(Request $request)
	{
		$site_id = $request->input('site_id');
		
		if (empty($site_id)) {
			return $this->error();
		}
		
		$object = new CrawlObject;
		
		$params = [
			'site_id' => ['EQ', $site_id]
		];
		
		$rows = $object->find($params);
		$rows = iterator_to_array($rows);
		
		$results = [];
		
		foreach($rows as $obj) {
			$result = Api::transform($obj);
			
			$results[] = $result;
		}
		
		$data = [
			'account_id' => 1, // TODO: change this
			'site_id' => $site_id,
			'total' => count($results),
			'data' => $results
		];

		return $this->response($data, 'crawls', $request);
	}

	/**
	 * Properties of a single crawl session item
	 *
	 * @param $id
	 * @return \Symfony\Component\HttpFoundation\Response
	 */
	public function getCrawl($id)
	{
		if (empty($id)) {
			return $this->error();
		}
		
		$object = new CrawlObject;
		
		$result = $object->get($id);
		
		if (!$result) {
			return $this->error(404, 'Object not found.');
		}
		
		$data = Api::transform($object);

		return $this->response($data, 'crawl');
	}

	/**
	 * Update a crawl session item's information
	 *
	 * @param Request $request
	 * @param $id
	 * @return \Symfony\Component\HttpFoundation\Response
	 */
	public function putCrawl(Request $request, $id)
	{
		$object = new CrawlObject;
		
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

			return $this->response($item, 'crawl_put');
		} else {
			return $this->error();
		}
	}

	/**
	 * Create a new crawl session item
	 *
	 * @param Request $request
	 * @return \Symfony\Component\HttpFoundation\Response
	 */
	public function postCrawl(Request $request)
	{
		$site_id = $request->input('site_id');
		
		$data = $request->input();
		
		// nope
		unset($data['id']);
		
		// basic validation - TODO: make this better
		if (empty($site_id)) {
			return $this->error(400, 'Site ID is required.');
		}
		
		$object = new CrawlObject;
		
		$object->id = \Ramsey\Uuid\Uuid::Uuid4();
		$object->set($data);
		
		$result = $object->save();
		
		if ($result) {
			$data = Api::transform($object);

			return $this->response($data, 'crawl_post');
		} else {
			return $this->error();
		}
	}

	/**
	 * Delete a crawl session item
	 *
	 * @param Request $request
	 * @param $id
	 * @return \Symfony\Component\HttpFoundation\Response
	 */
	public function deleteCrawl(Request $request, $id)
	{
		$object = new CrawlObject;
		
		$result = $object->get($id);
		
		if (!$result) {
			return $this->error(404, 'Object not found.');
		}
		
		$result = $object->delete();
		
		if ($result) {
			$response = [
				'deleted' => true
			];

			return $this->response($response, 'crawl_delete');
		} else {
			return $this->error();
		}
	}
}
