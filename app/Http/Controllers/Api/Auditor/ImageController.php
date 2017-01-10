<?php

namespace App\Http\Controllers\Api\Auditor;

use App\Http\Controllers\Api\AuditorController as AuditorController;
use Illuminate\Http\Request as Request;

use App\Models\Auditor\Image;
use App\Models\Auditor\Page;
use App\Models\Api;

class ImageController extends AuditorController
{
	public function __construct(Request $request)
	{
		parent::__construct($request);
	}

	/**
	 * List of all images for a single crawl or page
	 *
	 * @param Request $request
	 * @return \Symfony\Component\HttpFoundation\Response
	 */
	public function getImages(Request $request)
	{
		$response = Image::all($request);
		
		foreach($response['records'] as &$row) {
			$row['rel'] = [
				'pages' => sprintf('#visibility', $row['url_hash']),
			];
		}

		return $this->response($response, 'images', $request);
	}

	/**
	 * Properties of a single image item
	 *
	 * @param $id
	 * @return \Symfony\Component\HttpFoundation\Response
	 */
	public function getImage($id)
	{
		$object = Image::read($id);
		
		if (!$object) {
			return $this->error(404);
		}
		
		$response = Api::transform($object);

		return $this->response($response, 'image');
	}

	/**
	 * List of all pages that a link occurs on
	 *
	 * @param Request $request
	 * @return \Symfony\Component\HttpFoundation\Response
	 */
	public function getPagesForImage(Request $request)
	{
		$url_hash = $request->input('url_hash'); // link url_hash

		if (empty($url_hash)) {
			return $this->error(400);
		}

		$response = Page::getFromImage($request);

		foreach($response['records'] as &$row) {
			$row['rel'] = [];
		}

		return $this->response($response, 'pagesforimage', $request);
	}
}