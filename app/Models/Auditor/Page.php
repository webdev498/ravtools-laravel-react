<?php

namespace App\Models\Auditor;

use \RavenTools\SiteAuditorData\Page as PageObject;

use App\Models\Api;

class Page extends Api
{
	public static $types = [
		'errors' => "pages.http_status >= 400",
		'redirects' => "pages.http_status = 301 OR pages.http_status = 302",
		'blocked' => "blocked > 0",
		'blocked_by_robots' => "blocked = 1",
		'blocked_by_noindex' => "blocked = 2",
		'missing_title' => "pages.http_status = 200 AND blocked = 0 AND page_title_size = 0",
		'invalid_title' => "pages.http_status = 200 AND blocked = 0 AND page_title_size > 0 AND page_title_size NOT BETWEEN 10 and 70",
		'missing_description' => "pages.http_status = 200 AND blocked = 0 AND meta_description_size = 0",
		'invalid_description' => "pages.http_status = 200 AND blocked = 0 AND meta_description_size > 0 AND meta_description_size NOT BETWEEN 50 AND 156",
		'missing_google_analytics' => "pages.http_status = 200 AND blocked = 0 AND has_ga = 0",
		'low_word_count' => "pages.http_status = 200 AND blocked = 0 AND content_words < 250",
		'missing_headers' => 'blocked = 0 AND http_status = 200 AND header_count_h1 = 0 AND header_count_h2 = 0 AND header_count_h3 = 0',
		'missing_schema_microdata' => 'http_status = 200 AND blocked = 0 AND schemas.page_id IS NULL'
	];
	
	public static $derived_columns = [
		'links_internal' => '(select exists (select l.id from links l where l.page_id = pages.id and l.internal = 1)) as links_internal',
		'links_external' => '(select exists (select l.id from links l where l.page_id = pages.id and l.internal = 1)) as links_external',
		'blocked_by_robots' => '(select case when blocked = 1 then 1 else 0 end) as blocked_by_robots',
		'blocked_by_noindex' => '(select case when blocked = 2 then 1 else 0 end) as blocked_by_noindex',
		'pages' => "(select count(distinct(l.url_hash)) from links l where l.url_hash = pages.url_hash) as pages",
		'redirects' => "(select count(distinct(p2.url_hash)) from pages p2 where p2.redirect_url = pages.url) as redirects",
		'duplicate_title' => '(select exists (select d.id from duplicates d where type = "title" and d.page_id1 = pages.id)) as duplicate_title',
		'duplicate_meta' => '(select exists (select d.id from duplicates d where type = "meta" and d.page_id1 = pages.id)) as duplicate_meta',
		'duplicate_content' => '(select exists (select d.id from duplicates d where type = "content" and d.page_id1 = pages.id)) as duplicate_content',
		'schema_items' => '(select sum(item_type_count) FROM schemas WHERE schemas.page_id = pages.id) as schema_items',
		'schema_types' => '(select group_concat(distinct(item_type)) from schemas WHERE schemas.page_id = pages.id) as schema_types'
	];
	
	public static $columns = [
		'id',
		'url',
		'url_hash',
		'redirect_url',
		'canonical_url',
		'http_status',
		'page_title',
		'page_title_size',
		'meta_description',
		'meta_description_size',
		'blocked',
		'has_ga',
		'headers',
		'content_simhash',
		'title_simhash',
		'meta_simhash',
		'content_length',
		'content_words',
		'internal_links',
		'external_links',
		'header_count_h1',
		'header_count_h2',
		'header_count_h3'
	];

	public static $joins = [
		'missing_schema_microdata' => 'LEFT JOIN schemas ON schemas.page_id = pages.id'
	];
	
	public static $conditional_order = [
		'blocked_by_robots' => 'blocked = 1',
		'blocked_by_noindex' => 'blocked = 2'
	];
	
	public static $default_options = [
		'default_columns' => ['url', 'url_hash', 'http_status', 'page_title', 'meta_description', 'canonical_url'],
		'searchable_columns' => ['url', 'redirect_url', 'canonical_url', 'http_status', 'page_title', 'meta_description']
	];
	
	public static $count_column = 'pages.url_hash';

	public static function all($request, $options = []) {
		$object = new PageObject;
		
		$options = array_merge(self::$default_options, $options);

		$results = self::paginate($request, $object, $options);
		
		return $results;
	}
	
	public static function count($request, $options = []) {
		$object = new PageObject;
		
		$options = array_merge(self::$default_options, $options);
		
		$params = self::buildParameters($request, $object, $options);

		return self::getCount($request, $object, $params);
	}
	
	public static function read($id) {
		$object = new PageObject;
		
		return $object->find($id);
	}

	public static function getFromLink($request, $options = []) {
		$options['conditions'] = sprintf('l.url_hash = "%s"', $request->input('url_hash'));
		$options['joins'] = 'INNER JOIN links l ON l.page_id = pages.id';
		
		return self::all($request, $options);
	}

	public static function getFromImage($request, $options = []) {
		$options['conditions'] = sprintf('i.url_hash = "%s"', $request->input('url_hash'));
		$options['joins'] = 'INNER JOIN images i ON i.page_id = pages.id';
		
		return self::all($request, $options);
	}

	public static function getFromDuplicateTitle($request, $options = []) {
		$options['conditions'] = sprintf('d.page_id2 = "%s" and type = "title"', $request->input('page_id'));
		$options['joins'] = 'INNER JOIN duplicates d ON d.page_id1 = pages.id';

		return self::all($request, $options);
	}

	public static function getFromDuplicateDescription($request, $options = []) {
		$options['conditions'] = sprintf('d.page_id2 = "%s" and type = "description"', $request->input('page_id'));
		$options['joins'] = 'INNER JOIN duplicates d ON d.page_id1 = pages.id';

		return self::all($request, $options);
	}

	public static function getFromDuplicateContent($request, $options = []) {
		$options['conditions'] = sprintf('d.page_id2 = "%s" and type = "content"', $request->input('page_id'));
		$options['joins'] = 'INNER JOIN duplicates d ON d.page_id1 = pages.id';
		
		return self::all($request, $options);
	}
}