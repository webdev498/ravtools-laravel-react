<?php

namespace App\Models\Auditor;

use \RavenTools\SiteAuditorData\Heading as HeadingObject;
use App\Models\Api;

class Heading extends Api
{
	public static $default_options = [
		'default_columns' => ['page_id', 'tag', 'text', 'title'],
		'searchable_columns' => ['tag', 'text', 'title']
	];
	
	public static function all($request, $options = []) {
		$object = new HeadingObject;
		
		$options = array_merge(self::$default_options, $options);
		
		$results = self::paginate($request, $object, $options);
		
		return $results;
	}
	
	public static function read($id) {
		$object = new HeadingObject;
		
		return $object->find($id);
	}
}