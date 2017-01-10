<?php

namespace App\Models;

use \RavenTools\SiteAuditorData\Package as PackageObject;
use \RavenTools\SiteAuditorData\Feature as FeatureObject;
use \RavenTools\SiteAuditorData\PackageFeature as PackageFeatureObject;
use \RavenTools\SiteAuditorData\AccountFeature as AccountFeatureObject;
use \RavenTools\SiteAuditorData\AccountService as AccountServiceObject;
use \RavenTools\SiteAuditorData\RedisClient as RedisClient;

/**
 * The AccountLimits class serves as a centralized place where all account limits based
 * functionality exists.
 */
class AccountLimits {
	protected $account_id = null;
	protected $account = null;
	protected $accountservice_object = null;
	protected $packagefeature_object = null;
	protected $accountfeature_object = null;
	protected $feature_object = null;
	protected $package_object = null;
	protected $redis_client = null;

	public function __construct($params = []) {
		if (array_key_exists('account_service', $params)) {
			$this->setAccountServiceObject($params['account_service']);
		} else {
			throw new \Exception('account_service is required');
		}

		if (isset($params['account'])) {
			$this->setAccount($params['account']);
		} else {
			throw new \Exception('account is required');
		}

		$this->account_id = $this->getAccount()->id;
	}

	/**
	 * Getter for the AccountService object
	 * 
	 * @return mixed
	 */
	public function getAccountServiceObject() {
		if (isset($this->accountservice_object)) {
			return $this->accountservice_object;
		}

		return new AccountServiceObject;
	}

	/**
	 * Getter for the Package object
	 * 
	 * @return mixed
	 */
	public function getPackageObject() {
		if (isset($this->package_object)) {
			return $this->package_object;
		}

		return new PackageObject;
	}

	/**
	 * Getter for the Feature object
	 * 
	 * @return mixed
	 */
	public function getFeatureObject() {
		if (isset($this->feature_object)) {
			return $this->feature_object;
		}

		return new FeatureObject;
	}

	/**
	 * Getter for the PackageFeature object
	 * 
	 * @return mixed
	 */
	public function getPackageFeatureObject() {
		if (isset($this->packagefeature_object)) {
			return $this->packagefeature_object;
		}

		return new PackageFeatureObject;
	}

	/**
	 * Getter for the AccountFeature object
	 * 
	 * @return mixed
	 */
	public function getAccountFeatureObject() {
		if (isset($this->accountfeature_object)) {
			return $this->accountfeature_object;
		}

		return new AccountFeatureObject;
	}

	/**
	 * Getter for the RedisClient object
	 * 
	 * @return mixed
	 */
	public function getRedisClient($connection) {
		if (isset($this->redis_client)) {
			return $this->redis_client;
		}

		return RedisClient::get($connection);
	}

	public function getAccount() {
		return $this->account;
	}

	public function setAccount($account) {
		$this->account = $account;
	}

	/**
	 * Setter for the AccountService object
	 * 
	 * @param mixed $accountservice_object The AccountService object
	 * @return void
	 */
	public function setAccountServiceObject($accountservice_object) {
		$this->accountservice_object = $accountservice_object;
	}

	/**
	 * Setter for the Feature object
	 * 
	 * @param mixed $feature_object The Feature object
	 * @return void
	 */
	public function setFeatureObject($feature_object) {
		$this->feature_object = $feature_object;
	}

	/**
	 * Setter for the Package object
	 * 
	 * @param mixed $package_object The Package object
	 * @return void
	 */
	public function setPackageObject($package_object) {
		$this->package_object = $package_object;
	}

	/**
	 * Setter for the PackageFeature object
	 * 
	 * @param mixed $packagefeature_object The PackageFeature object
	 * @return void
	 */
	public function setPackageFeatureObject($packagefeature_object) {
		$this->packagefeature_object = $packagefeature_object;
	}

	/**
	 * Setter for the AccountFeature object
	 * 
	 * @param mixed $accountfeature_object The AccountFeature object
	 * @return void
	 */
	public function setAccountFeatureObject($accountfeature_object) {
		$this->accountfeature_object = $accountfeature_object;
	}

	/**
	 * Setter for the RedisClient object
	 * 
	 * @param mixed $redis_client The RedisClient
	 * @return void
	 */
	public function setRedisClient($redis_client) {
		$this->redis_client = $redis_client;
	}

	/**
	 * Gets a list of redis keys for a given feature.
	 * 
	 * @return array Array consisting of: (monthly) limit, currant usage, extra credits remaining
	 */
	public function getRedisKeys($feature) {
		$usage_suffix = sprintf("%s_%s", date('m'), date('Y'));

		$limit_key = sprintf("%s_%s", $this->account_id, $feature);
		$usage_key = sprintf("%s_%s_%s", $this->account_id, $feature, $usage_suffix);
		$extra_key = sprintf("%s_%s_extra", $this->account_id, $feature);

		return [$limit_key, $usage_key, $extra_key];
	}

	/**
	 * Returns an array consisting of an account's monthly limit, current usage, and extra creits
	 * for a given feature based on their service and package.
	 * 
	 * @param string $feature The feature name (like "pages")
	 * @return array [monthly limit, current usage, extra credits]
	 */
	public function getByFeature($feature) {
		list($limit_key, $usage_key, $extra_key) = $this->getRedisKeys($feature);

		$client = $this->getRedisClient('storage');

		$limit = $client->get($limit_key);
		$usage = $client->get($usage_key);
		$extra = $client->get($extra_key);

		// set redis defaults if the keys do not exist
		if ($limit === false) {
			// look up the feature to get its id
			$feature_object = $this->getFeatureObject();
			
			$features = $feature_object->find([
				'keymap' => [
					'#N' => 'name'
				],
				'values' => [
					':name' => [
						'S' => (string) $feature
					]
				],
				'conditions' => '#N = :name',
				'limit' => 1
			]);

			$feature = $features->current();

			// look up the package feature to get the quantity
			$packagefeature_object = $this->getPackageFeatureObject();

			$package_features = $packagefeature_object->find([
				'values' => [
					':feature_id' => [
						'S' => $feature->id
					],
					':package_id' => [
						'S' => $this->getAccountServiceObject()->package_id
					]
				],
				'conditions' => 'feature_id = :feature_id and package_id = :package_id',
				'limit' => 1
			]);

			$package_feature = $package_features->current();

			// initialize the (monthly) limit key for the feature
			if (is_object($package_feature)) {
				$client->set($limit_key, $package_feature->quantity);
				$limit = $package_feature->quantity;
			}
		}

		// initialize the current usage key for the feature
		if ($usage === false) {
			$client->set($usage_key, 0);
			$usage = 0;
		}

		// initialize the extra credits key for the feature
		if ($extra === false) {
			$client->set($extra_key, 0);
			$extra = 0;
		}

		return [$limit, $usage, $extra];
	}

	/**
	 * Sets Account Limits for the account.
	 * 
	 * @param array $params Method parameters. package_id is required
	 * @return mixed Array of limits that were set if succssful
	 * @throws \Exception If any of the required parameters are missing
	 * @throws \Exception If the DynamoDB AccountService record failed to save
	 */
	public function setForAccount($params = []) {
		if (!isset($params['package_id'])) {
			throw new \Exception('Package id is required.');
		}

		// set up redis limits based on the account's package
		$packagefeature_object = $this->getPackageFeatureObject();

		$package_features = $packagefeature_object->find([
			'values' => [
				':package_id' => [
					'S' => (string) $params['package_id']
				]
			],
			'conditions' => 'package_id = :package_id'
		]);

		$client = $this->getRedisClient('storage');
		
		$result = [];

		foreach($package_features as $package_feature) {
			$feature_object = $this->getFeatureObject();

			// look up the feature to get the name
			$feature_object->get($package_feature->feature_id);

			$name = strtolower($feature_object->name);
			$quantity = $package_feature->quantity;

			list($limit_key, $usage_key, $extra_key) = $this->getRedisKeys($name);

			if (preg_match("/raventools\.com$/i", $this->account->email)) {
				$quantity = "unlimited";
			}

			$client->set($limit_key, $quantity);
			$result[$limit_key] = $quantity;
		}

		return $result;
	}

	/**
	 * Upgrades an account to a specific package_id
	 * 
	 * @param array $params List of parameters. package_id is required
	 * @return array
	 */
	public function upgradeForAccount($params = []) {
		if (!isset($params['package_id'])) {
			throw new \Exception('package_id is required');
		}

		$this->getAccountServiceObject()->package_id = $params['package_id'];
		$this->getAccountServiceObject()->save();

		// loop over all the package's new packagefeatures and set limits for the account
		$package_feature = $this->getPackageFeatureObject();

		$package_features = $package_feature->find([
			'values' => [
				':package_id' => [
					'S' => $this->getAccountServiceObject()->package_id
				]
			],

			'conditions' => 'package_id = :package_id'
		]);

		$result = [];
		$client = $this->getRedisClient('storage');

		foreach($package_features as $package_feature) {
			$feature = $this->getFeatureObject();
			$feature->get($package_feature->feature_id);

			list($limit_key, $usage_key, $extra_key) = $this->getRedisKeys($feature->name);

			$quantity = $package_feature->quantity;

			if (preg_match("/raventools\.com$/i", $this->account->email)) {
				$quantity = "unlimited";
			}

			$client->set($limit_key, $quantity);

			$result[$limit_key] = $quantity;
		}

		return $result;
	}

	/**
	 * Downgrades an account to a specific package_id
	 * 
	 * @param array $params List of parameters. package_id is required
	 * @return array
	 */
	public function downgradeForAccount($params = []) {
		if (!isset($params['package_id'])) {
			throw new \Exception('package_id is required');
		}

		$this->getAccountServiceObject()->package_id = $params['package_id'];
		$this->getAccountServiceObject()->save();

		// loop over all the package's new packagefeatures and set limits for the account
		$packagefeature_object = $this->getPackageFeatureObject();

		$package_features = $packagefeature_object->find([
			'values' => [
				':package_id' => [
					'S' => (string) $params['package_id']
				]
			],
			'conditions' => 'package_id = :package_id'
		]);
		
		$result = [];
		$client = $this->getRedisClient('storage');

		foreach($package_features as $package_feature) {
			$feature = $this->getFeatureObject();
			$feature->get($package_feature->feature_id);

			list($limit_key, $usage_key, $extra_key) = $this->getRedisKeys($feature->name);

			$limit = $client->get($limit_key);
			$usage = $client->get($usage_key);
			$extra = $client->get($extra_key);

			// initalize the extra key if it's not set because we're using incrBy
			if ($extra === false) {
				$client->set($extra_key, 0);
				$extra = 0;
			}

			if ($usage === false) {
				$client->set($usage_key, 0);
				$usage = 0;
			}

			if ($limit !== false) {
				// get the remaining credits for the feature and add it to their extra
				$remaining = $limit - $usage;

				// this should never happen, but just in case?
				if ($remaining < 0) {
					$remaining = 0;
				}

				$extra = $client->incrBy($extra_key, $remaining);
			}

			$quantity = $package_feature->quantity;

			if (preg_match("/raventools\.com$/i", $this->account->email)) {
				$quantity = "unlimited";
			}

			// set the limit to the new limit
			$client->set($limit_key, $quantity);

			$result[$limit_key] = $package_feature->quantity;
			$result[$extra_key] = $extra;
		}

		return $result;
	}

	/**
	 * Adds a given amount to an account's `extra` redis key for a feature through the
	 * AccountFeature model
	 * 
	 * @param array $params Method parameters. Required parameters are feature, quantity, and cost.
	 * @return array The new account limits ([monthly, current usage, extra credits])
	 * @throws \Exception If any of the required parameters are missing
	 * @throws \Exception If the feature was not found
	 * @throws \Exception If the AccountFeature failed to save
	 */
	public function addExtraToAccount($params = []) {
		foreach(['feature', 'quantity', 'cost'] as $param) {
			if (!isset($params[$param])) {
				throw new \Exception('Missing required parameter: ' . $param);
			}
		}

		$feature = $this->getFeatureObject();

		$feature = $feature->find([
			'keymap' => [
				'#N' => 'name'
			],
			'values' => [
				':name' => [
					'S' => (string) $params['feature']
				]
			],
			'conditions' => '#N = :name',
			'limit' => 1
		])->current();

		if (!is_object($feature)) {
			throw new \Exception('Feature not found: ' . $params['feature']);
		}

		// create the AccountFeature record
		$accountfeature_object = $this->getAccountFeatureObject();

		$accountfeature_object->account_id = $this->account_id;
		$accountfeature_object->feature_id = $feature->id;
		$accountfeature_object->quantity = $params['quantity'];
		$accountfeature_object->cost = $params['cost'];
		$accountfeature_object->created_ts = time();
		$accountfeature_object->updated_ts = time();

		if (!$accountfeature_object->save()) {
			throw new \Exception('Failed to save AccountFeature.');
		}

		// do redis things
		$client = $this->getRedisClient('storage');

		list($limit_key, $usage_key, $extra_key) = $this->getRedisKeys($feature->name);

		$extra = $client->get($extra_key);

		if ($extra === false) {
			$client->set($extra_key, 0);
		}

		$extra = $client->incrBy($extra_key, $params['quantity']);

		return [
			$extra_key => $extra
		];
	}

	/**
	 * Set an account's `extra` redis key to a certain value. Likely mainly used by admin.
	 * AccountFeature model
	 * 
	 * @param array $params Method parameters. Required parameters are feature and quantity.
	 * @return array The new account limits ([monthly, current usage, extra credits])
	 * @throws \Exception If any of the required parameters are missing
	 * @throws \Exception If the feature was not found
	 * @throws \Exception If the AccountFeature failed to save
	 */
	public function setExtraOnAccount($params = []) {
		foreach(['feature', 'quantity'] as $param) {
			if (!isset($params[$param])) {
				throw new \Exception('Missing required parameter: ' . $param);
			}
		}

		$feature = $this->getFeatureObject();

		$feature = $feature->find([
			'keymap' => [
				'#N' => 'name'
			],
			'values' => [
				':name' => [
					'S' => (string) $params['feature']
				]
			],
			'conditions' => '#N = :name',
			'limit' => 1
		])->current();

		if (!is_object($feature)) {
			throw new \Exception('Feature not found: ' . $params['feature']);
		}

		// do redis things
		$client = $this->getRedisClient('storage');

		list($limit_key, $usage_key, $extra_key) = $this->getRedisKeys($feature->name);

		$extra = $client->get($extra_key);

		if ($extra === false) {
			$client->set($extra_key, 0);
		}

		$extra = $client->set($extra_key, $params['quantity']);

		return [
			$extra_key => $extra
		];
	}
}