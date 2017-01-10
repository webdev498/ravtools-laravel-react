<?php

namespace App\Models\Stripe;

use App\Models\Stripe;
use App\Models\Stripe\Base as Base;

class Plan extends Base\Feature
{
	public function __construct($params = array()) {
		parent::__construct($params);
	}

	public function get($plan_id) {
		$stripe = $this->getStripe();
		$plan = $stripe->plans()->find($plan_id);

		return $plan ?: false;
	}

	public function getAll($params = array()) {
		$stripe = $this->getStripe();
		$plans = $stripe->plans()->all($params);

		return $plans;
	}

	public function create($params) {
		$stripe = $this->getStripe();
		$plan = $stripe->plans()->create($params);

		return $plan['id'] ?: false;
	}

	public function update($plan_id, $params = array()) {
		$stripe = $this->getStripe();
		$plan = $stripe->plans()->update($plan_id, $params);

		return $plan['name'] ?: false;
	}

	public function delete($plan_id) {
		$stripe = $this->getStripe();
		$plan = $stripe->plans()->delete($plan_id);

		return $plan ?: false;
	}
}
