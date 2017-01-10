<?php

namespace App\Http\Controllers\Api\Auditor;

use App\Http\Controllers\Api\AuditorController as AuditorController;
use Illuminate\Http\Request as Request;

use App\Models\Auditor\Link;
use App\Models\Auditor\Page;
use \App\Models\Api;

class LinkController extends AuditorController
{
	public function __construct(Request $request)
	{
		parent::__construct($request);
	}

	/**
	 * List of all links for a single crawl or page
	 *
	 * @param Request $request
	 * @return \Symfony\Component\HttpFoundation\Response
	 */
	public function getLinks(Request $request)
	{
		$response = Link::all($request);	
	
		foreach($response['records'] as &$row) {
			$row['rel'] = [
				'links' => [
					'internal' => sprintf('#links/internal/?page_id=%s', $row['id']),
					'external' => sprintf('#links/external/?page_id=%s', $row['id']),
				],
				'pages' => sprintf('#visibility/?url_hash=%s', $row['url_hash']),
				
			];
		}

		return $this->response($response, 'links', $request);
	}

	/**
	 * List of all pages that a link occurs on
	 *
	 * @param Request $request
	 * @return \Symfony\Component\HttpFoundation\Response
	 */
	public function getPagesForLink(Request $request)
	{
		$url_hash = $request->input('url_hash'); // link url_hash

		if (empty($url_hash)) {
			return $this->error(400);
		}

		$response = Page::getFromLink($request);

		foreach($response['records'] as &$row) {
			$row['rel'] = [];
		}

		return $this->response($response, 'pagesforlink', $request);
	}

	/**
	 * Properties of a single link item
	 *
	 * @param $id
	 * @return \Symfony\Component\HttpFoundation\Response
	 */
	public function getLink($id)
	{
		$object = Link::read($id);
		
		if (!$object) {
			return $this->error(404);
		}
		
		$response = Api::transform($object);

		return $this->response($response, 'link');
	}
}