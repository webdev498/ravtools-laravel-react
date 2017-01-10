<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller as Controller;
use Illuminate\Http\Request as Request;

class ErrorController extends Controller
{
	/*
	public function __construct(Request $request)
	{
		parent::__construct($request);
	}
	*/

	/**
	 * List of errors of a particular type (and optionally in a particular language)
	 *
	 * @param $error_category
	 * @param $language
	 * @return \Symfony\Component\HttpFoundation\Response
	 */
	public function getErrors($error_category = 'generic', $language = 'en')
	{
		$original_category = $error_category;
		$error_data = array();

		switch ($error_category) {
			case 'generic': // if requesting the generic errors, skip the logic to load a specific error class
				$error_data = \Errors\Error::getErrors(); // currently ignores language

				break;

			default: // this is the default that most will use
				$error_category = str_replace('_', ' ', $error_category); // split words by underscore
				$error_category = ucwords($error_category); // Capitalize first letter of words
				$error_category = str_replace(' ', '', $error_category); // remove space for proper class name

				break;
		}

		// if error data is a non-empty array, then we're manually supplying error data
		if (count(array_keys($error_data)) === 0) {
			$language = ucwords($language);

			// this structure will likely change in a follow-up PR
			$class_name = '\\Errors\\' . $language . '\\' . $error_category;

			$error_class = new $class_name;
			$error_data = $error_class->toArray();	
		}
		
		$error_data = json_encode($error_data);

		$data = "define(['/assets/error/{$original_category}.js'], function (Error) { return {$error_data}; });";

		return response($data)->header('Content-Type', 'application/javascript');
	}
}
