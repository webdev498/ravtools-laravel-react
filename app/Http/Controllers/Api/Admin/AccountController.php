<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Api\AdminController as AdminController;
use Illuminate\Http\Request as Request;

use \RavenTools\SiteAuditorData\Account as AccountObject;
use \RavenTools\SiteAuditorData\Service as ServiceObject;
use \RavenTools\SiteAuditorData\Package as PackageObject;
use \RavenTools\SiteAuditorData\AccountService as AccountServiceObject;
use \RavenTools\SiteAuditorData\User as UserObject;

use App\Models\Api;

use App\Models\AccountLimits as AccountLimits;

use Log;

class AccountController extends AdminController
{
	public function __construct(Request $request)
	{
		parent::__construct($request);
	}

	/**
	 * List of all accounts
	 *
	 * @param Request $request
	 * @return \Symfony\Component\HttpFoundation\Response
	 */
	public function getAccounts(Request $request)
	{
		$account_object = new AccountObject;

		// TODO - Dynamo doesn't support sorting yet, so sorting not gonna sort
		$accounts = $account_object->find([
			'limit' => 1000
		]);

		$accounts = iterator_to_array($accounts);
		
		$data = array(
			'total' => count($accounts),
			'filtered' => count($accounts),
			'records' => $accounts
		);

		return $this->response($data, 'accounts', $request);
	}

	/**
	 * Properties of a single account item, including most recent crawl id
	 *
	 * @param Request $request
	 * @return \Symfony\Component\HttpFoundation\Response
	 */
	public function getAccount(Request $request)
	{
		$account_id = $this->getRequestAccountId($request);

		// if not a string, an error response; return it
		if (!is_string($account_id)) {
			return $account_id;
		}

		$account_object = new AccountObject;
		$service_object = new ServiceObject;
		$accountservice_object = new AccountServiceObject;
		$package_object = new PackageObject();
		
		$result = $account_object->get($account_id);
		
		if (!$result) {
			return $this->error(404, 'Object not found.');
		}

		$account = API::transform($account_object);

		$existing_service = $service_object->find([
			'keymap' => [
				'#N' => 'name'
			],
			'values' => [
				':name' => [
					'S' => 'Site Auditor'
				]
			],

			'conditions' => '#N = :name', // TODO this needs keymap, too
			'limit' => 1
		]);

		$existing_service = $existing_service->current();

		$service_id = $existing_service->id;

		$existing_accountservice = $accountservice_object->find([
			'values' => [
				':account_id' => [
					'S' => $account_object->id
				],
				':service_id' => [
					'S' => (string) $service_id
				]
			],

			'conditions' => 'account_id = :account_id and service_id = :service_id',
			'limit' => 1
		]);

		$existing_accountservice = $existing_accountservice->current();

		$package_object->get($existing_accountservice->package_id);

		$account_limits = new AccountLimits([
			'account' => $account_object,
			'account_service' => $existing_accountservice
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

		$account['package'] = [
			'id' => $package_object->id,
			'name' => $package_object->name,
			'cost' => $package_object->cost,
			'billing_pages_remaining' => $remaining,
			'extra_pages_remaining' => number_format($extra)
		];

		return $this->response($account, 'account');
	}

	/**
	 * Update a account item's information
	 *
	 * @param Request $request
	 * @return \Symfony\Component\HttpFoundation\Response
	 */
	public function putAccount(Request $request)
	{
		$account_id = $this->getRequestAccountId($request);

		// if not a string, an error response; return it
		if (!is_string($account_id)) {
			return $account_id;
		}

		$account_object = new AccountObject;
		
		$result = $account_object->get($account_id);
		
		if (!$result) {
			return $this->error(404, 'Object not found.');
		}
		
		$data = $request->input();
		
		// nope
		unset($data['id']);
		
		$account_object->set($data);
		
		$result = $account_object->save();
		
		if ($result) {
			$item = Api::transform($account_object);

			return $this->response($item, 'account_put');
		} else {
			return $this->error();
		}
	}

	/**
	 * Create a new account item for a particular domain
	 *
	 * @param Request $request
	 * @return \Symfony\Component\HttpFoundation\Response
	 */
	public function postAccount(Request $request)
	{
		$data = $request->input();

		// nope
		unset($data['id']);
		
		// probably need more defaults for this
		$defaults = [
			'created_ts' => time()
		];

		$data = array_merge($data, $defaults);

		$account_object = new AccountObject;

		$account_object->id = \Ramsey\Uuid\Uuid::Uuid4();
		$account_object->set($data);
		
		$result = $account_object->save();
		
		if ($result) {
			$account = Api::transform($account_object);

			return $this->response($account, 'account_post');
		} else {
			return $this->error();
		}
	}

	/**
	 * Delete a account item
	 *
	 * @param Request $request
	 * @return \Symfony\Component\HttpFoundation\Response
	 */
	public function deleteAccount(Request $request) {
		$account_id = $this->getRequestAccountId('account_id');

		// if not a string, an error response; return it
		if (!is_string($account_id)) {
			return $account_id;
		}

		$account_object = new AccountObject;
		
		$result = $account_object->get($account_id);
		
		if (!$result) {
			return $this->error(404, 'Object not found.');
		}
		
		$result = $account_object->delete();
		
		if ($result) {
			$response = [
				'deleted' => true
			];

			return $this->response($response, 'account_delete');
		} else {
			return $this->error();
		}
	}

	/**
	 * Update an account's extra pages count in Redis
	 *
	 * @param Request $request
	 * @return \Symfony\Component\HttpFoundation\Response
	 */
	public function setExtraPagesOnAccount(Request $request)
	{
		$account_id = $this->getRequestAccountId($request);

		// if not a string, an error response; return it
		if (!is_string($account_id)) {
			return $account_id;
		}

		$account_object = new AccountObject;
		
		$result = $account_object->get($account_id);
		
		if (!$result) {
			return $this->error(404, 'Object not found.');
		}
		
		$total = $request->input('total');

		$account_limits = new AccountLimits([
			'account' => $account_object,
			'account_service' => null
		]);

		$result = $account_limits->setExtraOnAccount([
			'feature' => 'pages',
			'quantity' => (int) $total
		]);
		
		if ($result) {
			$item = [
				'pages' => $total
			];

			return $this->response($item, 'account_put');
		} else {
			return $this->error();
		}
	}

	/**
	 * Retrieves the account_id from a standard $request
	 * Could potentially be used in the future to determine if valid account_id or not.
	 *
	 * @param $request
	 * @return \Symfony\Component\HttpFoundation\Response
	 */
	protected function getRequestAccountId($request) {
		$account_id = $request->input('account_id');

		// basic validation - TODO: make this better
		if (empty($account_id)) {
			return $this->error(400, 'Account ID is required.');
		}

		return $account_id;
	}
}
