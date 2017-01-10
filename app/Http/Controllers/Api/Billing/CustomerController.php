<?php

namespace App\Http\Controllers\Api\Billing;

use App\Http\Controllers\Api\BillingController as BillingController;
use Illuminate\Http\Request as Request;

use App\Config;

use App\Models\Stripe\Base\Utility as Utility;
use App\Models\Stripe\Customer as Customer;
use \RavenTools\SiteAuditorData\TransactionalEmail as TransactionalEmail;
use \RavenTools\SiteAuditorData\ListSubscription as ListSubscription;

use \RavenTools\SiteAuditorData\Site as SiteObject;
use \RavenTools\SiteAuditorData\CrawlSession as CrawlObject;
use \RavenTools\SiteAuditorData\IssueExclusion as IssueExclusionObject;
use \RavenTools\SiteAuditorData\PathExclusion as PathExclusionObject;
use \RavenTools\SiteAuditorData\AccountService as AccountServiceObject;
use \RavenTools\SiteAuditorData\AccountFeature as AccountFeatureObject;
use \RavenTools\SiteAuditorData\Share as ShareObject;
use \RavenTools\SiteAuditorData\Cancel as CancelObject;

class CustomerController extends BillingController
{
	public function cancelAccount(Request $request) {
		$cancel_reason = $request->input('cancel_reason');

		if (empty($cancel_reason)) {
			$data = [
				'error' => 'Reason for cancelling is required.'
			];

			return response()->json($data);
		}

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

		if (array_key_exists('deleted', $existing_customer) && $existing_customer['deleted'] == 1) {
			$data = [
				'error' => 'Account is already deleted.' // this error should never happen, but we know how that goes
			];

			return response()->json($data);	
		}

		if (!array_key_exists('id', $existing_customer)) {
			$data = [
				'error' => 'Account not valid.'
			];

			return response()->json($data);	
		}

		$cancel_object = new CancelObject;
		$cancel_object->id = $account_object->id;
		$cancel_object->stripe_customer_id = $account_object->stripe_customer_id;
		$cancel_object->reason = $cancel_reason;
		$cancel_object->signup_ts = $account_object->created_ts;
		$cancel_object->cancel_ts = time();
		$cancel_object->save();
		
		$deleted_customer = $customer->delete($account_object->stripe_customer_id);

		if (!array_key_exists('id', $deleted_customer)) {
			$data = [
				'error' => 'Failed to cancel account.'
			];

			return response()->json($data);
		}

		if (!$this->is_phpunit) {
			$transactional_email = new TransactionalEmail();
			$transactional_email->send('cancellation_email', $this->account->email, [
				'firstname' => $this->account->name
			]);

			// unsubscribe from lists
			$list_subscription = new ListSubscription([
				'list' => 'welcome_series_list',
				'email' => $this->account->email
			]);

			$list_subscription->delete();

			$list_subscription = new ListSubscription([
				'list' => 'first_crawl_complete_list',
				'email' => $this->account->email
			]);

			$list_subscription->delete();
		}

		$data = [
			'result' => 'cancelled'
		];

		$site_object = new SiteObject;

		// delete all the account sites
		$rows = $site_object->find([
			'values' => [
				':account_id' => [
					'S' => $this->account_id
				]
			],

			'conditions' => 'account_id = :account_id'
		]);

		foreach($rows as $site) {
			$crawl_object = new CrawlObject;

			$crawls = $crawl_object->find([
				'values' => [
					':site_id' => [
						'S' => $site->id
					]
				],

				'conditions' => 'site_id = :site_id'
			]);

			foreach($crawls as $crawl) {
				$crawl->delete();
			}

			$site->delete();

			$issue_exclusion = new IssueExclusionObject;

			foreach($issue_exclusion->find([
				'values' => [
					':site_id' => [
						'S' => $site->id
					]
				],

				'conditions' => 'site_id = :site_id'
			]) as $object) {
				$object->delete();
			}

			$path_exclusion = new PathExclusionObject;

			foreach($path_exclusion->find([
				'values' => [
					':site_id' => [
						'S' => $site->id
					]
				],

				'conditions' => 'site_id = :site_id'
			]) as $object) {
				$object->delete();
			}
		}

		$account_service = new AccountServiceObject;

		foreach($account_service->find([
			'values' => [
				':account_id' => [
					'S' => $this->account_id
				]
			],

			'conditions' => 'account_id = :account_id'
		]) as $object) {
			$object->delete();
		}

		$account_feature = new AccountFeatureObject;

		foreach($account_feature->find([
			'values' => [
				':account_id' => [
					'S' => $this->account_id
				]
			],

			'conditions' => 'account_id = :account_id'
		]) as $object) {
			$object->delete();
		}

		$share = new ShareObject;

		foreach($share->find([
			'values' => [
				':account_id' => [
					'S' => $this->account_id
				]
			],

			'conditions' => 'account_id = :account_id'
		]) as $object) {
			$object->delete();
		}

		$this->account->delete(); // this delete should have logic soon to remove associated records
		$this->user->delete(); // TODO: Remove this once the Account object does its own deleting

		return $this->response($data, 'customer.cancel');
	}
}