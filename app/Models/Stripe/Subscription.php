<?php

namespace App\Models\Stripe;

use App\Models\Stripe;
use App\Models\Stripe\Base as Base;

class Subscription extends Base\Feature
{
	public function __construct($params = array()) {
		parent::__construct($params);
	}

	public function get($customer_id, $subscription_id) {
		$stripe = $this->getStripe();
		$subscription = $stripe->subscriptions()->find($customer_id, $subscription_id);

		return $subscription ?: false;
	}

	public function getAll($customer_id, $params = array()) {
		$stripe = $this->getStripe();
		$subscriptions = $stripe->subscriptions()->all($customer_id, $params = array());

		return $subscriptions;
	}

	public function create($customer_id, $params = array()) {
		$stripe = $this->getStripe();
		$subscription = $stripe->subscriptions()->create($customer_id, $params);

		return $subscription['id'] ?: false;
	}

	public function update($customer_id, $subscription_id, $params = array()) {
		$stripe = $this->getStripe();
		$subscription = $stripe->subscriptions()->update($customer_id, $subscription_id, $params);

		return $subscription['name'] ?: false;
	}

	public function delete($customer_id, $subscription_id) {
		$stripe = $this->getStripe();
		$subscription = $stripe->subscriptions()->delete($customer_id, $subscription_id);

		return $subscription ?: false;
	}

	public function cancel($customer_id, $subscription_id, $delay_until_end_of_period = false) {
		$stripe = $this->getStripe();
		$subscription = $stripe->subscriptions()->cancel($customer_id, $subscription_id, $delay_until_end_of_period);

		return $subscription['id'] ?: false;
	}

	public function reactivate($customer_id, $subscription_id) {
		$stripe = $this->getStripe();
		$subscription = $stripe->subscriptions()->reactivate($customer_id, $subscription_id);

		return $subscription['id'] ?: false;
	}

	public function delete_discount($customer_id, $subscription_id) {
		$stripe = $this->getStripe();
		$subscription = $stripe->subscriptions()->deleteDiscount($customer_id, $subscription_id);

		return $subscription ?: false;	
	}
}
