<?php

namespace App\Models\Auditor;

use \RavenTools\SiteAuditorData\Link as LinkObject;
use App\Models\Api;

class Link extends Api
{
	public static $types = [
		'internal_broken' => "http_status >= 400 AND internal = 1",
		'internal_missing_anchor_or_alt' => "http_status < 400 AND internal = 1 AND ((link_type = 'text' AND anchor = '') OR (link_type = 'image' AND alt = ''))",
		'internal_nofollow' => "http_status < 400 AND internal = 1 AND nofollow = 1",
		'external_broken' => "http_status >= 400 AND internal = 0",
		'external_missing_anchor_or_alt' => "http_status < 400 AND internal = 0 AND ((link_type = 'text' AND anchor = '') OR (link_type = 'image' AND alt = ''))",
		'external_nofollow' => "http_status < 400 AND internal = 0 AND nofollow = 1",
	];
	
	public static $derived_columns = [
		'broken' => "(select case when http_status >= 400 then 1 else 0 end) as broken",
		'pages' => "(select count(distinct(l.page_id)) from links l where l.url_hash = links.url_hash) as pages"
	];
	
	public static $default_options = [
		'default_columns' => ['url', 'url_hash', 'page_id', 'http_status', 'anchor', 'alt', 'title'],
		'searchable_columns' => ['url', 'redirect_url', 'http_status', 'anchor', 'alt', 'title']
	];

	public static $columns = [
		'id', 'page_id', 'url', 'url_hash', 'broken', 'redirect_url', 'anchor', 'title', 'alt', 'http_status', 'internal', 'nofollow', 'link_type',	'blocked_robots'
	];

	public static $global_group_by = 'links.url_hash';
	public static $count_column = 'links.url_hash';

	public static function all($request, $options = []) {
		$object = new LinkObject;
		
		$options = array_merge(self::$default_options, $options);
		
		$results = self::paginate($request, $object, $options);
		
		return $results;
	}
	
	public static function read($id) {
		$object = new LinkObject;
		
		return $object->find($id);
	}
	
	public static function count($request, $options = []) {
		$object = new LinkObject;
		
		$options = array_merge(self::$default_options, $options);
		
		$params = self::buildParameters($request, $object, $options);
		
		return self::getCount($request, $object, $params);
	}
}