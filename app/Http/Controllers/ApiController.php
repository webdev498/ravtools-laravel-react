<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request as Request;
use Lcobucci\JWT\Parser as JWTParser;
use Lcobucci\JWT\ValidationData as JWTValidationData;

use App\Http\Helpers\FormatHelper as FormatHelper;

use \RavenTools\SiteAuditorData\Account as AccountObject;
use \RavenTools\SiteAuditorData\User as UserObject;
use \RavenTools\SiteAuditorData\Service as ServiceObject;
use \RavenTools\SiteAuditorData\Package as PackageObject;
use \RavenTools\SiteAuditorData\AccountService as AccountServiceObject;
use \RavenTools\SiteAuditorData\Share as ShareObject;
use \RavenTools\SiteAuditorData\Site as SiteObject;
use \RavenTools\SiteAuditorData\TransactionalEmail as TransactionalEmail;
use \RavenTools\SiteAuditorData\ListSubscription as ListSubscription;

use App\Models\AccountLimits as AccountLimits;

use App\Models\Stripe\Base\Utility as Utility;
use App\Models\Stripe\Customer as Customer;

use Log;

class ApiController extends Controller
{
	public $account_service = null;
	public $account_id = null;
	public $account = null;
	public $user_id = null;
	public $user = null;
	public $is_phpunit = false;

	public function __construct(Request $request)
	{
		if (!$request->is('*/key')) {
			$this->checkKey($request);
		}
	}

	public function response($data, $id, $request = null) {
		if ($request) {
			$format = $request->input('format');
			$columns = $request->input('columns');

			if (!empty($format)) {
				return FormatHelper::generate($data, $format, $columns, $id);
			}
		}

		return response()->json($data);
	}

	protected function getAccountId() {
		return $this->account_id;
	}

	protected function getUserId() {
		return $this->user_id;
	}

	/**
	 * Gets API Key based on user's Account ID
	 *
	 * @param Request $request
	 * @return \Symfony\Component\HttpFoundation\Response
	 */
	public function getKey(Request $request)
	{
		/*
		$api_key = 'pineapple';

		$data = array(
			'api_key' => $api_key
		);

		return response()->json($data);
		*/
		$key_details = $this->checkKey($request);

		// if checkKey returned a Lumen response, return that response and bail
		if (!is_array($key_details)) {
			return $key_details;
		}
		
		return response()->json($key_details);
	}

	/**
	 * Checks for valid API Key for each request
	 *
	 * @param $api_key
	 */
	public function checkKey($request) // not enforcing type in case of unit tests
	{
		$site_id = $request->input('site_id');
		$hash = $request->input('hash');
		$url = $request->input('url');
		$api_key = $request->input('api_key'); // only used if not requesting a key
		$user_token = $request->input('token'); // only used if requesting a key
		$temp_token = $request->input('temp_token'); // only used if requesting a key from a shared page
		$user_profile = $request->input('profile');
		$user_profile = json_decode($user_profile, true);

		// if api_key was sent, set that to token so we can continue validating
		if (empty($user_token) && !empty($api_key)) {
			$user_token = $api_key;
		}

		// if the api_key matches the share key format, then it's actually a share key. clear out the other thing.
		if ($this->checkShareKeyFormat($user_token)) {
			$temp_token = $user_token;
			$user_token = null;
		}

		// check if this is a share scenario by figuring out what's being viewed
		$share_check_options = [
			'user_token' => $user_token,
			'share_key' => $temp_token,
			'site_id' => $site_id,
			'url' => $url
		];

		$share_check = $this->checkShare($share_check_options);

		$user_token = str_replace('"', '', $user_token);
		$phpunit_key = (getenv('APP_ENV') == 'testing' && strlen($user_token) == 3);

		if (!$phpunit_key && (empty($user_token) || !preg_match("/.*?\..*?\..*?/", $user_token))) {
			if (($site_id || preg_match("/^\#s\//", $url)) || ($api_key == $hash) && $share_check !== false) {
				return $share_check;
			}

			abort(400);
		}

		/* https://github.com/lcobucci/jwt */

		if (!$phpunit_key) {
			$jwt_parser = new JWTParser();
			$token = $jwt_parser->parse((string) $user_token);

			if (is_array($user_profile) && count(array_keys($user_profile)) > 0) {			
				try {
					$name = $token->getClaim('name');
					$email = $token->getClaim('email');
					$email_verified = $token->getClaim('email_verified');

					if (intval($email_verified) != 1) {
						abort(400);	
					}	
				}
				catch (\OutOfBoundsException $ex) {
					abort(406); // token is invalid because we're attempting to get a claim that isn't there
				}
				
				$user_profile['name'] = $name;
				$user_profile['email'] = $email;
			}

			$validation = new JWTValidationData();
/*
			// just checking for expiration
			if (!(int)$token->validate($validation)) {
				abort(401);
			}

			$validation->setIssuer('https://raven-auditor.auth0.com/');
			$validation->setAudience('9kWf2McjX59zFjzRGKL29I4zVGnMhatS');

			// checking for an incorrectly formatted token
			if (!(int)$token->validate($validation)) {
				abort(400);
			}
*/
			$auth0_token = $token->getClaim('sub');
		}
		else {
			$auth0_token = $user_token; // just for PHPUnit
			$this->is_phpunit = true;
		}

		$user_object = new UserObject;
		$account_object = new AccountObject;
		$service_object = new ServiceObject;
		$accountservice_object = new AccountServiceObject;
		$package_object = new PackageObject;
		$site_object = new SiteObject;
		
		$params = [
			'values' => [
				':auth0_id' => [
					'S' => $auth0_token
				]
			],

			'conditions' => 'auth0_id = :auth0_id',
			'limit' => 1
		];

		$existing_user = $user_object->find($params)->current();

		if(is_object($existing_user) && $existing_user->status != 1) {
			// null out user if status != 1 (for now)
			$existing_user = null;
		}

		if (!is_object($existing_user) && empty($user_profile)) {
			abort(401);
		}

		// if the user matches and there's no profile, just return what's needed
		if (is_object($existing_user) && empty($user_profile)) {
			if (!empty($site_id) && $share_check !== false) {
				$site_object->get($site_id);

				if ($site_object->id && ($site_object->account_id != $existing_user->account_id)) {
					return $share_check;
				}
			}
			elseif (preg_match("/\#s\//", $url)) { // always return share on a share url
				return $share_check;
			}

			$api_key = $user_token;


			$this->account_id = $existing_user->account_id;
			$this->user_id = $existing_user->id;

			$account_object->get($this->account_id);

			if ($phpunit_key) {
				$account_object->stripe_customer_id = 'cus_8Na3GRQpN7HDea';
			}

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
						'S' => $this->account_id
					],
					':service_id' => [
						'S' => (string) $service_id
					]
				],

				'conditions' => 'account_id = :account_id and service_id = :service_id',
				'limit' => 1
			]);

			$existing_accountservice = $existing_accountservice->current();

			$this->account_service = $existing_accountservice;
			$this->account = $account_object;
			$this->user = $existing_user;

			return $api_key;
		}
		elseif (is_object($existing_user)) { // if the user exists, update the profile as needed
			if (!empty($site_id) && $share_check !== false) {
				$site_object->get($site_id);

				if ($site_object->id && ($site_object->account_id != $existing_user->account_id)) {
					return $share_check;
				}
			} elseif (preg_match("/\#s\//", $url)) {
				return $share_check;
			}

			$existing_user->login_ts = time();

			$this->account_id = $existing_user->account_id;
			$this->user_id = $existing_user->id;

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

			$existing_package = $package_object->find([
				'keymap' => [
					'#N' => 'name'
				],
				'values' => [
					':name' => [
						'S' => 'Free'
					]
				],

				'conditions' => '#N = :name',
				'limit' => 1
			]);

			$existing_package = $existing_package->current();

			$package_id = $existing_package->id;

/* yo */
			$existing_account = $account_object->find([
				'keymap' => [
					'#S' => 'status'
				],
				'values' => [
					':id' => [
						'S' => $existing_user->account_id
					],
					':status' => [
						'S' => '1'
					]
				],

				'conditions' => 'id = :id and #S = :status', // TODO make this use keymap or whatev -  and status = :status',
				'limit' => 1
			]);

			$existing_account = $existing_account->current();

			if (!$existing_account) {
				// TODO add token invalidation here (401?) once auth is updated to use non-trial account of auth0
				$data = array(
					'error' => 'Invalid account for user token.'
				);

				return response()->json($data);
			}

			$existing_accountservice = $accountservice_object->find([
				'values' => [
					':account_id' => [
						'S' => $this->account_id
					],
					':service_id' => [
						'S' => (string) $service_id
					]
				],

				'conditions' => 'account_id = :account_id and service_id = :service_id',
				'limit' => 1
			]);

			$existing_accountservice = $existing_accountservice->current();

			if (!$existing_accountservice) {
				// TODO add token invalidation here (401?) once auth is updated to use non-trial account of auth0
				$data = array(
					'error' => 'No access to this service.'
				);

				return response()->json($data);
			}

			if ($phpunit_key) {
				$existing_account->stripe_customer_id = 'cus_8Na3GRQpN7HDea';
			}

			$existing_user->auth0_id = $auth0_token; // TODO: auth0_id is by third-party provider, so this needs a separate storage by provider
			$existing_user->name = $user_profile['name'];
			$existing_user->login_ts = time();
			$existing_user->save();

			if ($existing_account->total_crawls == 1) {
				// can assume they've logged back in after getting their first crawl results email
				// so, unsubscribe from the 'first crawl results' list
				$list_subscription = new ListSubscription([
					'list' => 'first_crawl_complete_list',
					'email' => $existing_account->email
				]);

				$list_subscription->delete();
			}

			$this->account = $existing_account;
			$this->account_service = $existing_accountservice;
			$this->user = $existing_user;
		}
		elseif (!empty($user_profile)) { // else, create the user/account
			$account_object = new AccountObject;
			$account_object->auth0_id = $auth0_token; // TODO: auth0_id is by third-party provider, so this needs a separate storage by provider
			$account_object->name = $user_profile['name'];
			$account_object->email = $user_profile['email'];
			$account_object->status = 1;
			$account_object->created_ts = time();
			$account_object->updated_ts = time();
			$account_object->save();

			$existing_account = $account_object;
			$this->account = $existing_account;
			$this->account_id = $account_object->id;

			$user_object = new UserObject();
			$user_object->account_id = $this->account_id;
			$user_object->auth0_id = $auth0_token; // TODO: auth0_id is by third-party provider, so this needs a separate storage by provider
			$user_object->name = $user_profile['name'];
			$user_object->email = $user_profile['email'];
			$user_object->status = 1;
			$user_object->created_ts = time();
			$user_object->updated_ts = time();
			$user_object->login_ts = time();
			$user_object->save();

			$existing_user = $user_object;
			$this->user = $existing_user;
			$this->user_id = $existing_user->id;

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

			$package_object = new PackageObject();
			$existing_package = $package_object->find([
				'keymap' => [
					'#N' => 'name'
				],
				'values' => [
					':name' => [
						'S' => 'Free'
					]
				],

				'conditions' => '#N = :name', // TODO this needs keymap, too
				'limit' => 1
			]);

			$existing_package = $existing_package->current();

			$package_id = $existing_package->id;
			
			$accountservice_object = new AccountServiceObject;
			$accountservice_object->account_id = $this->account_id;
			$accountservice_object->service_id = $service_id;
			$accountservice_object->package_id = $package_id;
			$accountservice_object->created_ts = time();
			$accountservice_object->updated_ts = time();
			$accountservice_object->save();

			$existing_accountservice = $accountservice_object;

			$account_limits = new AccountLimits([
				'account' => $this->account,
				'account_service' => $accountservice_object
			]);

			// set account limits for this new account
			$account_limits->setForAccount([
				'package_id' => $package_id
			]);

			if ($phpunit_key) {
				$existing_account->stripe_customer_id = 'cus_8Na3GRQpN7HDea';

				$this->account = $existing_account;
			}
			else {
				$customer_result = $this->createCustomer($request);

				// if createCustomer returned a Lumen response, return that response and bail
				if (!is_array($customer_result)) {
					$data = [
						'error' => 'Customer creation failed with an unknown error.'
					];

					return response()->json($data);
				}

				if (is_array($customer_result) && !array_key_exists('stripe_customer_id', $customer_result)) {
					if (array_key_exists('result', $customer_result)) {
						$data = [
							'error' => $customer_result
						];

						return response()->json($data);
					}

					$data = [
						'error' => 'Customer creation failed with an invalid error.'
					];

					return response()->json($data);
				}

				if (!$this->is_phpunit) {
					$email = new TransactionalEmail();
					$email->send('new_user_signup_email', $existing_account->email, [
						'firstname' => $existing_account->name
					]);

					$list_subscription = new ListSubscription([
						'list' => 'welcome_series_list',
						'name' => $existing_account->name,
						'email' => $existing_account->email
					]);

					$list_subscription->save();
				}
			}
		}

		$api_key = $user_token; // TODO: needs real api key logic

		$account_limits = new AccountLimits([
			'account' => $existing_account,
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

		$response = [
			'user_id' => $existing_user->id,
			'account_id' => $existing_account->id,
			'api_key' => $api_key,
			'user' => [
				'id' => $existing_user->id,
				'name' => $existing_user->name,
				'email' => $existing_user->email,
				'status' => $existing_user->status,
				'created_ts' => $existing_user->created_ts,
				'updated_ts' => $existing_user->updated_ts,
				'login_ts' => $existing_user->login_ts
			],
			'account' =>  [
				'id' => $existing_account->id,
				'name' => $existing_account->name,
				'email' => $existing_account->email,
				'status' => $existing_account->status,
				'created_ts' => $existing_account->created_ts,
				'updated_ts' => $existing_account->updated_ts
			],
			'package' => [
				'id' => $existing_package->id,
				'name' => $existing_package->name,
				'cost' => $existing_package->cost,
				'billing_pages_remaining' => $remaining,
				'extra_pages_remaining' => number_format($extra)
			]
		];

		return $response;
	}

	public function isPossibleShareRoute($url) {
		return !preg_match("/^\#(login|sites)/", $url);
	}

	public function checkShareKeyFormat($share_key) {
		if (!preg_match("/^\w{8}$/", $share_key)) {
			return false;
		}

		return true;	
	}

	/**
	 * Checks for valid share key for a shared link, then use that to init 
	 *
	 * @param $api_key
	 */
	public function checkShare($options)
	{
		$share_key = $options['share_key'];
		$site_id = $options['site_id'];
		$url = $options['url'];

		if (!$this->checkShareKeyFormat($share_key)) {
			return false;
		}

		$site_account_id = null;

		if (!empty($site_id)) {
			$site_object = new SiteObject();
			$site_object->get($site_id);

			if ($site_object->id) {
				$site_account_id = $site_object->account_id;
			}
		}

		$share_object = new ShareObject;
		$share_object->get($share_key);

		if (!$share_object->id) {
			if (!empty($options['user_token'])) {
				return false;
			}

			abort(401);
		}

		$account_object = new AccountObject;
		$account_object->get($share_object->account_id);

		if (!$account_object->id) {
			if (!empty($options['user_token'])) {
				return false;
			}

			abort(400);
		}

		// if the site id is empty (because of a share page) or it's not empty and the account ended up matching the share account, return the key to use
		if ((empty($site_id) && $this->isPossibleShareRoute($url)) || $site_account_id == $account_object->id) {
			return [
				'account_id' => $account_object->id,
				'api_key' => $share_key
			];
		}

		// ... else, return false to allow the normal api verification to occur for a logged in user
		return false;
	}

	public function createCustomer(Request $request) {
		$account_object = new AccountObject;
		$account_object->get($this->account_id);

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
				'error' => 'Account is missing required data.'
			];

			return response()->json($data);
		}

		$customer_details = [
			'account_balance' => 0,
			'email' => $account_object->email,
			'plan' => 'AUDITORFREE',

			'metadata' => [
				'id' => $account_object->id,
				'name' => $account_object->name
			]
		];

		$customer_params = [
			'stripe' => Utility::getStripeAPIObject()
		];

		$customer = new Customer($customer_params);

		$result = $customer->create($customer_details);

		// if successful, store customer id as returned from 'create'
		if (!empty($result)) {
			$account_object->stripe_customer_id = $result;
			$account_object->save();

			return [
				'stripe_customer_id' => $result
			];
		}

		$data = [
			'result' => $result
		];

		return $data;
	}
}