<?php

namespace App\Models\Stripe;

use App\Models\Stripe;
use App\Models\Stripe\Base as Base;

class Customer extends Base\Feature
{
	public function __construct($params = array()) {
		parent::__construct($params);
	}

	public function get($customer_id) {
		$stripe = $this->getStripe();
		$customer = $stripe->customers()->find($customer_id);

		return $customer ?: false;
	}

	public function getAll($params = array()) {
		$stripe = $this->getStripe();
		$customers = $stripe->customers()->all($params);

		return $customers;
	}

	public function create($params = array()) {
		$stripe = $this->getStripe();
		$customer = $stripe->customers()->create($params);

		return $customer['id'] ?: false;
	}

	public function update($customer_id, $params = array()) {
		$stripe = $this->getStripe();
		$customer = $stripe->customers()->update($customer_id, $params);

		return $customer ?: false;
	}

	public function delete($customer_id) {
		$stripe = $this->getStripe();
		$customer = $stripe->customers()->delete($customer_id);

		return $customer ?: false;
	}

	public function delete_discount($customer_id) {
		$stripe = $this->getStripe();
		$customer = $stripe->customers()->deleteDiscount($customer_id);

		return $customer ?: false;
	}
}
