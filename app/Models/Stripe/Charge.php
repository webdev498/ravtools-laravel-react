<?php

namespace App\Models\Stripe;

use App\Models\Stripe;
use App\Models\Stripe\Base as Base;

class Charge extends Base\Feature
{
	public function __construct($params = array()) {
		parent::__construct($params);
	}

	public function get($charge_id) {
		$stripe = $this->getStripe();
		$charge = $stripe->charges()->find($charge_id);

		return $charge ?: false;
	}

	public function getAll($params = array()) { // filtering by customer id can be done with params
		$stripe = $this->getStripe();
		$charges = $stripe->charges()->all($params);

		return $charges;
	}

	public function create($params) {
		$stripe = $this->getStripe();
		$charge = $stripe->charges()->create($params);

		return $charge['id'] ?: false;
	}

	public function update($charge_id, $params = array()) {
		$stripe = $this->getStripe();
		$charge = $stripe->charges()->update($charge_id, $params);

		return $charge['email'] ?: false;
	}

	public function capture($charge_id, $params = array()) { // recipient email is available to send email after charging
		$stripe = $this->getStripe();
		$charge = $stripe->charges()->create($charge_id, $params);

		return $charge ?: false;
	}
}
