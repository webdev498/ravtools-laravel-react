<?php

namespace Errors;

class Error {
	// Pretending to be constants so we can attach behavior to these global ones when used
	private static $unknown = 'An unknown error has occurred.';
	private static $not_implemented = 'Not implemented.';

	public static function showError($constant_name) {
		// throw a warning because a custom error message wasn't implemented somewhere where it's needed
		error_log('Generic error [' . $constant_name . '] was called.'); // Lumen appears to be catching and handling all error types, even notices
		
		$constant_name = strtolower($constant_name);

		return self::${$constant_name};
	}

	public static function getErrors() {
		// throw a warning because something is requesting generic errors for use somewhere
		error_log('Generic errors are being requested.'); // Lumen appears to be catching and handling all error types, even notices

		return array(
			'UNKNOWN' => self::$unknown,
			'NOT_IMPLEMENTED' => self::$not_implemented
		);
	}

	public function toArray() {
		$reflection_object = new \ReflectionClass(get_called_class());
		$class_constants = $reflection_object->getConstants();

		return $class_constants;
	}
}
