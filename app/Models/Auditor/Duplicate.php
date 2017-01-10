<?php

namespace App\Models\Auditor;

use \RavenTools\SiteAuditorData\Page as PageObject;
use \RavenTools\SiteAuditorData\Duplicate as DuplicateObject;

use App\Models\Api;

class Duplicate extends Api
{
	public static $types = [
		'titles' => 'type = "title"',
		'descriptions' => 'type = "description"',
		'content' => 'type = "content"',
	];
	
	public static $derived_columns = [
		'links_internal' => '(select exists (select l.id from links l where l.page_id = pages.id and l.internal = 1)) as links_internal',
		'links_external' => '(select exists (select l.id from links l where l.page_id = pages.id and l.internal = 1)) as links_external',
		'duplicate_title' => '(select count(distinct(page_id2)) from duplicates where type = "title" and page_id1 = pages.id) as duplicate_title',
		'duplicate_meta' => '(select count(distinct(page_id2)) from duplicates where type = "description" and page_id1 = pages.id) as duplicate_meta',
		'duplicate_content' => '(select count(distinct(page_id2)) from duplicates where type = "content" and page_id1 = pages.id) as duplicate_content',
	];
	
	public static $default_options = [
		// `id` should be a `page_id`, for aliasing (too ambiguous)
		'default_columns' => ['id', 'page_id1', 'page_id2', 'url', 'url_hash', 'http_status', 'page_title', 'meta_description'],
		'searchable_columns' => ['url', 'http_status', 'page_title', 'meta_description']
	];
	
	public static $joins = [
		'titles' => 'INNER JOIN duplicates ON (duplicates.page_id1 = pages.id)',
		'descriptions' => 'INNER JOIN duplicates ON (duplicates.page_id1 = pages.id)',
		'content' => 'INNER JOIN duplicates ON (duplicates.page_id1 = pages.id)'
	];
	
	public static $group = [
		'titles' => 'url_hash',
		'descriptions' => 'url_hash',
		'content' => 'url_hash'
	];

	public static $count_column = 'page_id1';

	public static function all($request, $options = []) {
		$object = new PageObject;
		
		$options = array_merge(self::$default_options, $options);
		
		$results = self::paginate($request, $object, $options);
		
		return $results;
	}
	
	public static function read($id) {
		$duplicate = new DuplicateObject;
		$object = new DuplicateObject;
		
		return $object->find($id);
	}
	
	public static function count($request, $options = []) {
		$duplicate = new DuplicateObject;
		$object = new PageObject;
		
		$options = array_merge(self::$default_options, $options);
		
		$params = self::buildParameters($request, $object, $options);
		
		return self::getCount($request, $object, $params);
	}
}