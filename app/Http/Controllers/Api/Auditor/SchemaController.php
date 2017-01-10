<?php

namespace App\Http\Controllers\Api\Auditor;

use App\Http\Controllers\Api\AuditorController as AuditorController;
use Illuminate\Http\Request as Request;

use App\Models\Auditor\Schema;
use \App\Models\Api;

class SchemaController extends AuditorController
{
	public function __construct(Request $request)
	{
		parent::__construct($request);
	}

	/**
	 * List of schema items found on a single page (http://schema.org/docs/schemas.html)
	 *
	 * @param Request $request
	 * @return \Symfony\Component\HttpFoundation\Response
	 */
	public function getSchemas(Request $request)
	{
		$response = Schema::all($request);

		return $this->response($response, 'schemas', $request);
	}

	/**
	 * Properties of a single schema item
	 *
	 * @param String $id
	 * @return \Symfony\Component\HttpFoundation\Response
	 */
	public function getSchema($id)
	{
		$object = Schema::read($id);
		
		if (!$object) {
			return $this->error(404);
		}
		
		$response = Api::transform($object);

		return $this->response($response, 'schema');
	}
}