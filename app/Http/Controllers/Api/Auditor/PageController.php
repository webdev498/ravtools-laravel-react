<?php

namespace App\Http\Controllers\Api\Auditor;

use App\Http\Controllers\Api\AuditorController as AuditorController;
use Illuminate\Http\Request as Request;

use App\Models\Auditor\Page;
use App\Models\Api;

class PageController extends AuditorController
{
	public function __construct(Request $request)
	{
		parent::__construct($request);
	}

	/**
	 * List of all pages for a single crawl
	 *
	 * @param Request $request
	 * @return \Symfony\Component\HttpFoundation\Response
	 */
	public function getPages(Request $request)
	{
		$site_id = $request->input('site_id');

		$response = Page::all($request);

		foreach($response['records'] as &$row) {
			if (isset($row['blocked_by_robots'])) {
				$row['blocked_by_robots'] = $row['blocked_by_robots'] ? 'Yes' : 'No';
			}

			if (isset($row['blocked_by_noindex'])) {
				$row['blocked_by_noindex'] = $row['blocked_by_noindex'] ? 'Yes' : 'No';
			}

			$row['rel'] = [
				'links' => [
					'internal' => sprintf('#links/internal/' . $site_id . '?page_id=%s', $row['id']),
					'external' => sprintf('#links/external/' . $site_id . '?page_id=%s', $row['id']),
				],
				'pages' => sprintf('#visibility/' . $site_id . '?url_hash=%s', $row['url_hash']),
				'redirects' => sprintf('#visibility/redirects/' . $site_id . '?url_hash=%s', $row['url_hash']),
			];
		}

		return $this->response($response, 'pages', $request);
	}

	/**
	 * Properties of a single page item
	 *
	 * @param $id
	 * @return \Symfony\Component\HttpFoundation\Response
	 */
	public function getPage($id)
	{
		$object = Page::read($id);
		
		if (!$object) {
			return $this->error(404);
		}
		
		$response = Api::transform($object);

		return $this->response($response, 'page');
	}
}
