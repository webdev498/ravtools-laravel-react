<?php

namespace App;

class Config extends \Noodlehaus\Config {

	private static $instance = null;

	public static function getInstance() {

		if(is_null(self::$instance)) {

			$config_env = strtolower(getenv("CONFIG_ENV")) ?: "vagrant";

			self::$instance = new static([
				sprintf("%s/../config/common.json",__DIR__),
				sprintf("%s/../config/%s.json",__DIR__,$config_env)
			]);

			self::$instance->bootstrap();
		}

		return self::$instance;
	}

	private function bootstrap() {

		date_default_timezone_set($this->get("timezone"));
	}
}
