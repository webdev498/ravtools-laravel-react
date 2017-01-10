<?php

namespace App\Models\Auditor;

use \RavenTools\SiteAuditorData\Resource as ResourceObject;
use App\Models\Api;

class Resource extends Api
{
	public static $derived_columns = [
		'page' => '(select url from pages where pages.id = images.page_id) as page',
		'pages' => '(select count(distinct(r2.page_id)) from resources r2 where r2.url_hash = resources.url_hash group by r2.page_id) as pages',
	];
	
	public static $default_options = [
		'default_columns' => ['url', 'url_hash', 'http_status', 'mime_type', 'size'],
		'searchable_columns' => ['url']
	];
	
	public static function all($request, $options = []) {
		$object = new ResourceObject;
		
		$options = array_merge(self::$default_options, $options);
		
		$results = self::paginate($request, $object, $options);
		
		return $results;
	}
	
	public static function read($id) {
		$object = new ResourceObject;
		
		return $object->find($id);
	}
	
	public static function count($request, $options = []) {
		$object = new ResourceObject;
		
		$options = array_merge(self::$default_options, $options);
		
		$params = self::buildParameters($request, $object, $options);
		
		return self::getCount($object, $params);
	}
}