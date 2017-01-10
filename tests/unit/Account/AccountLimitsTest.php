<?php

use \Mockery as m;
use App\Models\AccountLimits as AccountLimits;

class AccountServiceMock {
	public $account_id = 'site-auditor-account-id';
	public $service_id = 'bloop';
}

class AccountMock {
	public $id = 'site-auditor-account-id';
	public $email = 'test.com';
}

class AccountLimitsTest extends TestCase
{
	protected $object = null;
	protected $account_id = 'site-auditor-account-id';

	public function setUp() {
		$this->object = new AccountLimits([
			'account_service' => new AccountServiceMock,
			'account' => new AccountMock
		]);
	}

	public function tearDown() {

	}

	public function testAccountServiceObjectInjection() {
		$this->object->setAccountServiceObject('test');
		$this->assertEquals('test', $this->object->getAccountServiceObject());
	}

	public function testFeatureInjection() {
		$this->object->setFeatureObject('test');
		$this->assertEquals('test', $this->object->getFeatureObject());
	}

	public function testPackageInjection() {
		$this->object->setPackageObject('test');
		$this->assertEquals('test', $this->object->getPackageObject());
	}

	public function testPackageFeatureInjection() {
		$this->object->setPackageFeatureObject('test');
		$this->assertEquals('test', $this->object->getPackageFeatureObject());
	}

	public function testAccountFeatureInjection() {
		$this->object->setAccountFeatureObject('test');
		$this->assertEquals('test', $this->object->getAccountFeatureObject());
	}

	public function testRedisClientInjection() {
		$this->object->setRedisClient('test');
		$this->assertEquals('test', $this->object->getRedisClient('blargh'));
	}

	public function testGetRedisKeys() {
		$month = date('m') . '_' . date('Y');

		$expected = [
			$this->account_id . '_pages',
			$this->account_id . '_pages_' . $month,
			$this->account_id . '_pages_extra'
		];

		$result = $this->object->getRedisKeys('pages');

		$this->assertEquals($expected, $result);	
	}
}