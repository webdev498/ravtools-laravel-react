<?php

namespace App\Http\Controllers\Api\Billing;

use App\Http\Controllers\Api\BillingController as BillingController;
use Illuminate\Http\Request as Request;

use App\Config;

use App\Models\Stripe\Base\Utility as Utility;
use App\Models\Stripe\Customer as Customer;
use App\Models\Stripe\Charge as Charge;

use App\Models\AccountLimits as AccountLimits;

use \RavenTools\SiteAuditorData\Service as ServiceObject;

class ChargeController extends BillingController
{
	public function purchasePages(Request $request) {
		$pages = $request->input('pages');

		$account_object = $this->account;

		if (!is_object($account_object)) {
			$data = [
				'error' => 'Account not found.'
			];

			return response()->json($data);			
		}

		$id = $account_object->id;
		$name = $account_object->name;
		$email = $account_object->email;

		if (empty($id) || empty($name) || empty($email)) {
			$data = [
				'error' => 'Account is missing required data.',
				'missing' => [
					'id' => (bool)empty($id),
					'name' => (bool)empty($name),
					'email' => (bool)empty($email)
				],
				'api_key' => $request->input('api_key'),
				'account_id' => $this->account_id
			];

			return response()->json($data);			
		}

		if (!$account_object->stripe_customer_id) {
			$data = [
				'error' => 'Only customers can charge items.'
			];

			return response()->json($data);
		}

		if (!is_numeric($pages)) {
			$data = [
				'error' => 'Invalid page total.'
			];

			return response()->json($data);	
		}

		switch ($pages) {
			case 50000:
				$amount = '49.00';
				$description = 'Raven Site Auditor: ' . $pages .= ' pages for $' . $amount . '.';

				break;

			default:
				$data = [
					'error' => 'Invalid page total.'
				];

				return response()->json($data);			

				break;
		}

		if (!is_numeric($amount)) {
			$data = [
				'error' => 'Bad charge request.'
			];

			return response()->json($data);	
		}

		$params = [
			'stripe' => Utility::getStripeAPIObject()
		];

		$customer = new Customer($params);
		$result = $customer->get($account_object->stripe_customer_id);

		if (!$result) {
			$data = [
				'error' => 'Bad customer identifier.'
			];

			return response()->json($data);	
		}

		$charge_details = [
			'customer' => $account_object->stripe_customer_id,
			'amount' => $amount,
			'currency' => 'USD',
			'description' => $description,
			'receipt_email' => $email,
			'capture' => true, // charge them immediately

			'metadata' => [
				'account_id' => $id,
				'account_name' => $name
			]
		];

		$charge = new Charge($params);
		$result = $charge->create($charge_details);

		$data = [
			'result' => $result
		];

		$account_limits = new AccountLimits([
			'account' => $this->account,
			'account_service' => $this->account_service
		]);

		$account_limits->addExtraToAccount([
			'feature' => 'pages',
			'quantity' => (int) $pages,
			'cost' => $amount
		]);
		
		return response()->json($data);
	}
}