<?php

namespace App\Models\Stripe;

use App\Models\Stripe;
use App\Models\Stripe\Base as Base;

class Refund extends Base\Feature
{
	public function __construct($params) {
		parent::__construct($params);
	}

	public function get($charge_id, $refund_id) {
		$stripe = $this->getStripe();
		$refund = $stripe->refunds()->find($charge_id, $refund_id);

		return $refund ?: false;
	}

	public function getAll($charge_id, $params = array()) {
		$stripe = $this->getStripe();
		$refunds = $stripe->refunds()->all($charge_id, $params);

		return $refunds;
	}

	public function create($charge_id, $amount, $params = array()) { // params includes refund reason
		$stripe = $this->getStripe();
		$refund = $stripe->refunds()->create($charge_id, $amount, $params);

		return $refund['id'] ?: false;
	}

	public function update($charge_id, $refund_id, $params = array()) { // params are for refund metadata
		$stripe = $this->getStripe();
		$refund = $stripe->refunds()->update($charge_id, $refund_id, $params);

		return $refund['email'] ?: false;
	}
}
