<?php

namespace App\Http\Controllers\Api\Billing;

use App\Http\Controllers\Api\BillingController as BillingController;
use Illuminate\Http\Request as Request;

use App\Config;

use App\Models\Stripe\Base\Utility as Utility;
use App\Models\Stripe\InvoiceItem as InvoiceItem;

class InvoiceController extends BillingController
{
	public function getInvoices(Request $request) {
		$account_object = $this->account;

		if (!is_object($account_object)) {
			$data = [
				'error' => 'Account not found.'
			];

			return response()->json($data);			
		}

		if (!$account_object->stripe_customer_id) {
			$data = [
				'error' => 'Account invalid.'
			];

			return response()->json($data);			
		}

		$params = [
			'stripe' => Utility::getStripeAPIObject()
		];

		$invoice_item = new InvoiceItem($params);
		$invoice_items = $invoice_item->getAll([
			'customer' => $account_object->stripe_customer_id
		]);

		$filtered_invoice_items = [];

		if (is_array($invoice_items)) {
			foreach ($invoice_items as $invoice_item) {
				if ((int)$invoice_item['amount'] > 0) {
					$formatted_item = [
						'date' => date('m/d/y', $invoice_item['date']),
						'type' => $invoice_item['description'],
						'amount' => number_format($invoice_item['amount'] / 100, 2)
					];

					$filtered_invoice_items[] = $formatted_item;
				}
			}	
		}
		
		$data = [
			"draw" => 1,
			"total" => count($filtered_invoice_items),
			"filtered" => count($filtered_invoice_items),
			"records" => $filtered_invoice_items
		];

		return $this->response($data, 'invoices', $request);

		// TODO: I (@i) need to add a Stripe class for this
	}
}