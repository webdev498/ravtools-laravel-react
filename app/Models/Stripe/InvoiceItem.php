<?php

namespace App\Models\Stripe;

use App\Models\Stripe;
use App\Models\Stripe\Base as Base;

class InvoiceItem extends Base\Feature
{
	public function __construct($params = array()) {
		parent::__construct($params);
	}

	public function get($invoice_item_id) {
		$stripe = $this->getStripe();
		$invoiceItem = $stripe->invoiceItems()->find($invoice_item_id);

		return $invoiceItem ?: false;
	}

	public function getAll($params = array()) {
		$stripe = $this->getStripe();
		$invoiceItems = $stripe->invoiceItems()->all($params);

		return $invoiceItems['data'] ?: false;
	}

	public function create($customer_id, $params = array()) {
		$stripe = $this->getStripe();
		$invoice_item = $stripe->invoiceItems()->create($customer_id, $params);

		return $invoice_item['id'] ?: false;
	}

	public function update($invoice_item_id, $params = array()) {
		$stripe = $this->getStripe();
		$invoiceItem = $stripe->invoiceItems()->update($invoice_item_id, $params);

		return $invoiceItem ?: false;
	}

	public function delete($invoice_item_id) {
		$stripe = $this->getStripe();
		$invoiceItem = $stripe->invoiceItems()->delete($invoice_item_id);

		return $invoiceItem ?: false;
	}
}
