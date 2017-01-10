<?php

namespace App\Models\Auditor;

use \RavenTools\SiteAuditorData\Image as ImageObject;
use App\Models\Api;

class Image extends Api
{
	public static $types = [
		'broken' => "http_status >= 400",
		'missing_alt' => "http_status < 400 AND alt = ''",
		'missing_title' => "http_status < 400 AND title = ''"
	];
	
	public static $derived_columns = [
		'page' => '(select url from pages where pages.id = images.page_id) as page',
		'pages' => '(select count(distinct(i2.page_id)) from images i2 where i2.url_hash = images.url_hash) as pages',
		'broken' => '(select case when http_status >= 400 then 1 else 0 end) as broken'
	];
	
	public static $columns = ['id', 'page_id', 'url', 'url_hash', 'http_status', 'alt', 'title', 'size'];

	public static $default_options = [
		'default_columns' => ['url', 'page_id', 'url_hash', 'http_status', 'alt', 'title'],
		'searchable_columns' => ['url', 'http_status', 'alt', 'title']
	];

	public static $count_column = 'images.url_hash';
	public static $global_group_by = 'images.url_hash';

	public static function all($request, $options = []) {
		$object = new ImageObject;
		
		$options = array_merge(self::$default_options, $options);
		
		$results = self::paginate($request, $object, $options);
		
		return $results;
	}
	
	public static function read($id) {
		$object = new ImageObject;
		
		return $object->find($id);
	}
	
	public static function count($request, $options = []) {
		$object = new ImageObject;

		$options = array_merge(self::$default_options, $options);

		$params = self::buildParameters($request, $object, $options);
		
		return self::getCount($request, $object, $params);
	}
}