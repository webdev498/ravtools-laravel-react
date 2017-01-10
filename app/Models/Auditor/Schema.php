<?php

namespace App\Models\Auditor;

use \RavenTools\SiteAuditorData\Schema as SchemaObject;

use App\Models\Api;

class Schema extends Api
{
	public static $default_options = [
		'default_columns' => ['page_id', 'item_type', 'item_type_count'],
		'searchable_columns' => ['item_type']
	];
	
	public static function all($request, $options = []) {
		$object = new SchemaObject;
		
		$options = array_merge(self::$default_options, $options);
		
		$results = self::paginate($request, $object, $options);
		
		return $results;
	}
	
	public static function read($id) {
		$object = new SchemaObject;
		
		return $object->find($id);
	}
}