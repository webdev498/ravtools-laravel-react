<?php

namespace App\Models\Stripe\Base;

use App\Models\Stripe\Base;

use App\Config as Config;
use Cartalyst\Stripe\Laravel\Facades\Stripe as Stripe;

class Utility
{
	private static $_instance = null;

	public static function getStripeAPIObject() {
		if (is_object(self::$_instance)) {
			return self::$_instance;
		}

		$config = Config::getInstance();
		$stripe_private_key = $config['stripe']['secret_key']; // can also be an env variable named 'STRIPE_API_KEY'

		putenv('STRIPE_API_KEY=' . $stripe_private_key); // this is required to make this work, since...

		self::$_instance = Stripe::make($stripe_private_key); // ... this doesn't work. nfc why

		return self::$_instance;
	}
}
