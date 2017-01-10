<?php

namespace App\Http\Controllers\Api\Auditor;

use App\Http\Controllers\Api\AuditorController as AuditorController;
use Illuminate\Http\Request as Request;

use App\Models\Auditor\Duplicate;
use App\Models\Auditor\Page;

class DuplicateController extends AuditorController
{
	public function __construct(Request $request)
	{
		parent::__construct($request);
	}

	/**
	 * Summary stats for duplicates
	 *
	 * @param Request $request
	 * @return \Symfony\Component\HttpFoundation\Response
	 */
	public function getDuplicates(Request $request)
	{
		$response = Duplicate::all($request);

		return $this->response($response, 'duplicates', $request);
	}

	/**
	 * Duplicate page titles in pages
	 *
	 * @param Request $request
	 * @return \Symfony\Component\HttpFoundation\Response
	 */
	public function getTitles(Request $request)
	{
		$options = [
			'type' => 'titles'
		];
		
		$response = Duplicate::all($request, $options);

		return $this->response($response, 'titles', $request);
	}

	/**
	 * Duplicate meta descriptions in pages
	 *
	 * @param Request $request
	 * @return \Symfony\Component\HttpFoundation\Response
	 */
	public function getDescriptions(Request $request)
	{
		$options = [
			'type' => 'descriptions'
		];
		
		$response = Duplicate::all($request, $options);

		return $this->response($response, 'descriptions', $request);
	}

	/**
	 * Duplicate page content in pages
	 *
	 * @param Request $request
	 * @return \Symfony\Component\HttpFoundation\Response
	 */
	public function getContent(Request $request)
	{
		$options = [
			'type' => 'content'
		];
		
		$response = Duplicate::all($request, $options);
		
		foreach($response['records'] as &$row) {
			$row['rel'] = [
				'links' => [
					'internal' => sprintf('#links/internal/?page_id=%s', $row['id']),
					'external' => sprintf('#links/external/?page_id=%s', $row['id']),
				]
			];
		}

		return $this->response($response, 'content', $request);
	}

	/**
	 * List of all pages that a duplicate title occurs on
	 *
	 * @param Request $request
	 * @return \Symfony\Component\HttpFoundation\Response
	 */
	public function getPagesForTitles(Request $request)
	{
		$page_id = $request->input('page_id'); // duplicate page_id

		if (empty($page_id)) {
			return $this->error(400);
		}

		$response = Page::getFromDuplicateTitle($request);

		foreach($response['records'] as &$row) {
			$row['rel'] = [];
		}

		return $this->response($response, 'pagesforduplicatetitles', $request);
	}

	/**
	 * List of all pages that a duplicate description occurs on
	 *
	 * @param Request $request
	 * @return \Symfony\Component\HttpFoundation\Response
	 */
	public function getPagesForDescriptions(Request $request)
	{
		$page_id = $request->input('page_id'); // duplicate page_id

		if (empty($page_id)) {
			return $this->error(400);
		}

		$response = Page::getFromDuplicateDescription($request);

		foreach($response['records'] as &$row) {
			$row['rel'] = [];
		}

		return $this->response($response, 'pagesforduplicatedescriptions', $request);
	}

	/**
	 * List of all pages that a duplicate content occurs on
	 *
	 * @param Request $request
	 * @return \Symfony\Component\HttpFoundation\Response
	 */
	public function getPagesForContent(Request $request)
	{
		$page_id = $request->input('page_id'); // duplicate page_id

		if (empty($page_id)) {
			return $this->error(400);
		}

		$response = Page::getFromDuplicateContent($request);

		foreach($response['records'] as &$row) {
			$row['rel'] = [];
		}

		return $this->response($response, 'pagesforduplicatecontent', $request);
	}
}