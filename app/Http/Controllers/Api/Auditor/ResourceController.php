<?php

namespace App\Http\Controllers\Api\Auditor;

use App\Http\Controllers\Api\AuditorController as AuditorController;
use Illuminate\Http\Request as Request;

use App\Models\Auditor\Resource;
use App\Models\Api;

class ResourceController extends AuditorController
{
	public function __construct(Request $request)
	{
		parent::__construct($request);
	}

	/**
	 * List of all Resources for a crawl
	 *
	 * @param Request $request
	 * @return \Symfony\Component\HttpFoundation\Response
	 */
	public function getResources(Request $request)
	{
		$response = Resource::all($request);

		return $this->response($response, 'resources', $request);
	}

	/**
	 * Fetches a single resource item
	 *
	 * @param int $id
	 * @return \Symfony\Component\HttpFoundation\Response
	 */
	public function getResource($id)
	{
		$object = Resource::read($id);
		
		if (!$object) {
			return $this->error(404);
		}
		
		$response = Api::transform($object);

		return $this->response($response, 'resource');
	}
}