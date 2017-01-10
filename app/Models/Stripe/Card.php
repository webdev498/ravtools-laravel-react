<?php

namespace App\Models\Stripe;

use App\Models\Stripe;
use App\Models\Stripe\Base as Base;

class Card extends Base\Feature
{
	public function __construct($params = array()) {
		parent::__construct($params);
	}

	public function get($customer_id, $card_id) {
		$stripe = $this->getStripe();
		$card = $stripe->cards()->find($customer_id, $card_id);

		return $card ?: false;
	}

	public function getAll($customer_id, $params = array()) {
		$stripe = $this->getStripe();
		$cards = $stripe->cards()->all($customer_id, $params = array());

		return $cards;
	}

	public function create($customer_id, $params = array()) {
		$stripe = $this->getStripe();
		$card = $stripe->cards()->create($customer_id, $params);

		return $card['id'] ?: false;
	}

	public function update($customer_id, $card_id, $params = array()) {
		$stripe = $this->getStripe();
		$card = $stripe->cards()->update($params);

		return $card['name'] ?: false;
	}

	public function delete($customer_id, $card_id) {
		$stripe = $this->getStripe();
		$card = $stripe->cards()->delete($customer_id, $card_id);

		return $card ?: false;
	}

	public function cancel($customer_id, $card_id, $delay_until_end_of_period = false) {
		$stripe = $this->getStripe();
		$card = $stripe->cards()->cancel($customer_id, $card_id, $delay_until_end_of_period);

		return $card['id'] ?: false;
	}

	public function reactivate($customer_id, $card_id) {
		$stripe = $this->getStripe();
		$card = $stripe->cards()->reactivate($customer_id, $card_id);

		return $card['id'] ?: false;
	}

	public function delete_discount($customer_id, $card_id) {
		$stripe = $this->getStripe();
		$card = $stripe->cards()->deleteDiscount($customer_id, $card_id);

		return $card ?: false;	
	}
}
