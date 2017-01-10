<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\ApiController as ApiController;
use Illuminate\Http\Request as Request;

use Log;

class AdminController extends ApiController
{
	public function __construct(Request $request) {
		parent::__construct($request);
		
		$email = $this->account->email;

		if (!preg_match("/\@raventools.com$/", $email)) {
			abort(401);
		}
	}
	
	public function error($code = 400, $reason = null) {
		if (empty($reason)) {
			$reason = 'There was an error processing your request.';
		}
		
		return response()->json([
			'code' => $code,
			'reason' => $reason
		], $code);
	}
}
