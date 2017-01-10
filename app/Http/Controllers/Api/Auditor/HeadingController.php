<?php

namespace App\Http\Controllers\Api\Auditor;

use App\Http\Controllers\Api\AuditorController as AuditorController;
use Illuminate\Http\Request as Request;

use App\Models\Auditor\Heading;
use App\Models\Api;

class HeadingController extends AuditorController
{
	public function __construct(Request $request)
	{
		parent::__construct($request);
	}

	/**
	 * List of all headings (h1, h2, etc) on a single crawl or page
	 *
	 * @param Request $request
	 * @return \Symfony\Component\HttpFoundation\Response
	 */
	public function getHeadings(Request $request)
	{
		$response = Heading::all($request);

		return $this->response($response, 'headings', $request);
	}

	/**
	 * Properties of a single heading item
	 *
	 * @param $id
	 * @return \Symfony\Component\HttpFoundation\Response
	 */
	public function getHeading($id)
	{
		$object = Heading::read($id);
		
		if (!$object) {
			return $this->error(404);
		}
		
		$response = Api::transform($object);

		return $this->response($response, 'heading');
	}
}