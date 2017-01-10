<?php

namespace App\Http\Controllers\Api\Billing;

use App\Http\Controllers\Api\BillingController as BillingController;
use Illuminate\Http\Request as Request;

use App\Config;

use App\Models\Stripe\Base\Utility as Utility;
use App\Models\Stripe\Customer as Customer;
use App\Models\Stripe\Card as Card;

use App\Models\AccountLimits as AccountLimits;

use \RavenTools\SiteAuditorData\Package as PackageObject;
use \RavenTools\SiteAuditorData\TransactionalEmail as TransactionalEmail;

class PlanController extends BillingController
{
	public function getPlan(Request $request) {
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

		$customer = new Customer($params);

		$existing_customer = $customer->get($account_object->stripe_customer_id);

		if (!array_key_exists('subscriptions', $existing_customer)) {
			$data = [
				'error' => 'Account was cancelled.'
			];

			return response()->json($data);			
		}

		$plan_type = $existing_customer['subscriptions']['data'][0]['plan']['id'];
		$plan_type = str_replace('AUDITOR', '', $plan_type);
		$plan_type = strtolower($plan_type);

		$next_billing_ts = $existing_customer['subscriptions']['data'][0]['current_period_end'];

		$account_limits = new AccountLimits([
			'account' => $this->account,
			'account_service' => $this->account_service
		]);

		list($monthly, $usage, $extra) = $account_limits->getByFeature('pages');

		$remaining = $monthly - $usage;

		if ($remaining < 0) {
			$remaining = 0;
		}

		if ($monthly == 'unlimited') {
			$remaining = 'Unlimited';
		} else {
			$remaining = number_format($remaining);
		}

		$data = [
			'type' => $plan_type,
			'billing_pages_remaining' => $remaining,
			'extra_pages_remaining' => number_format($extra),
			'next_billing_ts' => $next_billing_ts
		];

		return $this->response($data, 'current');
	}

	public function upgradePlan(Request $request) {
		$plan = $request->input('plan');
		
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
				'error' => 'Only customers can upgrade.'
			];

			return response()->json($data);			
		}

		switch ($plan) {
			case 'grow':
				$stripe_plan = 'AUDITORGROW';
				$marketing_email = 'upgrade_free_to_grow_email';
				break;

			case 'pro':
				$stripe_plan = 'AUDITORPRO';
				$marketing_email = 'upgrade_grow_to_pro_email';
				break;

			default:
				$data = [
					'error' => 'Invalid plan.'
				];

				return response()->json($data);			

				break;
		}

		$params = [
			'stripe' => Utility::getStripeAPIObject()
		];

		$card = new Card($params);
		$cards = $card->getAll($account_object->stripe_customer_id);

		if (!is_array($cards) || count($cards) === 0) {
			$data = [
				'failure' => 'no card'
			];

			return response()->json($data);
		}

		$customer_details = [
			'plan' => $stripe_plan
		];

		$customer = new Customer($params);

		try {
			$result = $customer->update($account_object->stripe_customer_id, $customer_details);	
		}
		catch (\Cartalyst\Stripe\Exception\MissingParameterException $ex) {
			if (preg_match("/payment source/", $ex)) {
				$data = [
					'failure' => 'payment'
				];

				return response()->json($data);
			}
		}

		$package = new PackageObject;

		$package = $package->find([
			'keymap' => [
				'#N' => 'name'
			],
			'values' => [
				':name' => [
					'S' => ucwords($plan)
				]
			],

			'conditions' => '#N = :name',
			'limit' => 1
		])->current();

		$account_limits = new AccountLimits([
			'account' => $this->account,
			'account_service' => $this->account_service
		]);

		$account_limits->upgradeForAccount([
			'package_id' => $package->id
		]);

		if (!$this->is_phpunit) {
			$transactional_email = new TransactionalEmail();
			$transactional_email->send($marketing_email, $this->user->email, [
				'firstname' => $this->user->name
			]);
		}
		
		$data = [
			'plan' => $plan,
			'result' => $result['subscriptions']['data'][0]['plan']['name']
		];

		return response()->json($data);
	}

	public function downgradePlan(Request $request) {
		$plan = $request->input('plan');
		
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
				'account_id' => $this->account_id
			];

			return response()->json($data);			
		}

		if (!$account_object->stripe_customer_id) {
			$data = [
				'error' => 'Only customers can downgrade.'
			];

			return response()->json($data);			
		}

		$marketing_email = false;

		switch ($plan) {
			case 'free':
				$stripe_plan = 'AUDITORFREE';
				$marketing_email = 'downgrade_grow_to_free_email';
				break;

			case 'grow':
				$stripe_plan = 'AUDITORGROW';
				$marketing_email = 'downgrade_pro_to_grow_email';
				break;
/** yo - how does one downgrade to pro? **/
			case 'pro':
				$stripe_plan = 'AUDITORPRO';

				break;

			default:
				$data = [
					'error' => 'Invalid plan.'
				];

				return response()->json($data);

				break;
		}

		$params = [
			'stripe' => Utility::getStripeAPIObject()
		];

		$customer = new Customer($params);

		$existing_customer = $customer->get($account_object->stripe_customer_id);

		// order plans numerically to validate that downgrade is actually downgrading
		$plans = [
			'AUDITORFREE' => 0,
			'AUDITORGROW' => 1,
			'AUDITORPRO' => 2
		];

		$customer_plan = $existing_customer['subscriptions']['data'][0]['plan']['id'];
		$current_plan = $plans[$customer_plan];
		$new_plan = $plans[$stripe_plan];

		if ($current_plan <= $new_plan) {
			$data = [
				'error' => 'New plan is not a downgrade.'
			];

			return response()->json($data);
		}

		$customer_details = [
			'plan' => $stripe_plan
		];

		$result = $customer->update($account_object->stripe_customer_id, $customer_details);

		$package = new PackageObject;

		$package = $package->find([
			'keymap' => [
				'#N' => 'name'
			],
			'values' => [
				':name' => [
					'S' => ucwords($plan)
				]
			],

			'conditions' => '#N = :name',
			'limit' => 1
		])->current();

		$account_limits = new AccountLimits([
			'account' => $this->account,
			'account_service' => $this->account_service
		]);

		$account_limits->downgradeForAccount([
			'package_id' => $package->id
		]);

		if (!empty($marketing_email) && !$this->is_phpunit) {
			$transactional_email = new TransactionalEmail();
			$transactional_email->send($marketing_email, $this->user->email, [
				'firstname' => $this->user->name
			]);
		}

		$data = [
			'plan' => $plan,
			'result' => $result['subscriptions']['data'][0]['plan']['name']
		];

		return response()->json($data);
	}
}