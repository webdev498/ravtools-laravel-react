<?php

namespace App\Http\Controllers\Api\Billing;

use App\Http\Controllers\Api\BillingController as BillingController;
use Illuminate\Http\Request as Request;

use App\Config;

use App\Models\Stripe\Base\Utility as Utility;
use App\Models\Stripe\Customer as Customer;
use App\Models\Stripe\Card as Card;

class CardController extends BillingController
{
	public function getCards(Request $request) {
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

		$card = new Card($params);
		$cards = $card->getAll($account_object->stripe_customer_id);

		$data = $cards;

		return $this->response($data, 'current');
	}

	public function postCard(Request $request) {
		$token = $request->input('card_token');
		
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
				'error' => 'Only customers can add a card.'
			];

			return response()->json($data);
		}

		$params = [
			'stripe' => Utility::getStripeAPIObject()
		];

		if (empty($token)) {
			$data = [
				'error' => 'Card information is invalid.'
			];

			return response()->json($data);
		}

		$card = new Card($params);
		
		$result = $card->create($account_object->stripe_customer_id, $token);

		if (empty($result)) {
			$data = [
				'error' => 'Adding payment method failed.'
			];

			return response()->json($data);
		}

		$data = [
			'id' => $result
		];

		return response()->json($data);
	}

	public function deleteCard(Request $request) {
		$card_id = $request->input('card_id');
		
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
				'error' => 'Only customers can delete a card.'
			];

			return response()->json($data);
		}

		$params = [
			'stripe' => Utility::getStripeAPIObject()
		];

		if (empty($card_id)) {
			$data = [
				'error' => 'Card information is invalid.'
			];

			return response()->json($data);
		}

		$card = new Card($params);
		
		$result = $card->delete($account_object->stripe_customer_id, $card_id);

		if (empty($result)) {
			$data = [
				'error' => 'Deleting payment method failed.'
			];

			return response()->json($data);
		}

		$data = [
			'id' => $result
		];

		return response()->json($data);
	}
}