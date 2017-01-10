<?php

namespace App\Models\Stripe\Base;

use App\Models\Stripe\Base;

class Feature
{
	protected $stripe = null;
	protected $validator = null;

	public function __construct($params = array()) {
		if (is_array($params)) {
			if (array_key_exists('stripe', $params) && is_object($params['stripe'])) {
				$this->setStripe($params['stripe']);
			}

			// TODO add validators
			if (array_key_exists('validator', $params) && is_object($params['validator'])) {
				$this->setValidator($params['validator']);
			}	
		}
	}

	public function setStripe($stripe_object) {
		$this->stripe = $stripe_object;
	}

	public function getStripe() {
		return $this->stripe;
	}

	public function setValidator($validator_object) {
		$this->validator = $validator_object;
	}

	public function validate($params, $rules) {
		if (!is_object($this->validator)) {
			return $params;
		}

		return $this->validator->validate($params);
	}
}
