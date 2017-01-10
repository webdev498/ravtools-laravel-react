<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\ApiController as ApiController;
use Illuminate\Http\Request as Request;

class BillingController extends ApiController
{
	protected $stripe = null;

	public function __construct(Request $request)
	{
		parent::__construct($request);
	}

	public function showAccountId(Request $request) {
		$account_object = $this->account;

		$data = [
			'account_id' => $this->account_id,
			'account' => [
				'id' => $account_object->id,
				'name' => $account_object->name,
				'email' => $account_object->email
			]
		];

		return response()->json($data);
	}
}
