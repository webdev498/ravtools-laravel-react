<?php

namespace App\Models\Stripe;

use App\Models\Stripe;
use App\Models\Stripe\Base as Base;

class Coupon extends Base\Feature
{
	public function __construct($params = array()) {
		parent::__construct($params);
	}

	public function get($coupon_id) {
		$stripe = $this->getStripe();
		$coupon = $stripe->coupons()->find($coupon_id);

		return $coupon ?: false;
	}

	public function getAll($params = array()) {
		$stripe = $this->getStripe();
		$coupons = $stripe->coupons()->all($params);

		return $coupons;
	}

	public function create($params = array()) {
		$stripe = $this->getStripe();
		$coupon = $stripe->coupons()->create($params);

		return $coupon['id'] ?: false;
	}

	public function update($coupon_id, $params = array()) {
		$stripe = $this->getStripe();
		$coupon = $stripe->coupons()->update($coupon_id, $params);

		return $coupon['name'] ?: false;
	}

	public function delete($coupon_id) {
		$stripe = $this->getStripe();
		$coupon = $stripe->coupons()->delete($coupon_id);

		return $coupon ?: false;
	}
}
