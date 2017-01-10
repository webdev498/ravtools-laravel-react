<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\ApiController as ApiController;
use Illuminate\Http\Request as Request;

use \App\Models\Auditor\Duplicate;
use \App\Models\Auditor\Resource;
use \App\Models\Auditor\Page;
use \App\Models\Auditor\Link;
use \App\Models\Auditor\Image;
use \App\Models\Auditor\Heading;
use \App\Models\Auditor\Schema;

use \RavenTools\SiteAuditorData\Sqlite3Db;
use \RavenTools\SiteAuditorData\Site;
use \RavenTools\SiteAuditorData\Page as SqlitePage;
use \RavenTools\SiteAuditorData\CrawlSession;
use \RavenTools\SiteAuditorData\Config as DataConfig;

use \SiteAuditorSync\Config as SyncConfig;
use \SiteAuditorSync\DbFile;

use Log;

class AuditorController extends ApiController
{
	protected $is_staging = false;

	public function __construct(Request $request) {

		if (in_array(getenv('CONFIG_ENV'), ['vagrant'])) { // leaving as an array in case we want to add more
			$this->is_staging = true;
		}

		$site_id = $request->input("site_id");

		if ($site_id && !$request->isMethod('delete')) {
			// set crawl session if we have a site_id and it's not a delete
			$this->setCrawlSession($site_id);
		}

		parent::__construct($request);

		if (!empty($this->account_id) && !empty($site_id)) {
			$site = new Site;
			$site->get($site_id);

			if (!$site->id) {
				abort(410); // 410: Gone
			}

			if ($site->account_id != $this->account_id) {
				abort(401);
			}
		}
	}

	public function setCrawlSession($site_id) {

		static $site;
		static $session;

		if(is_null($site)) {
			$site = new Site;
			$site->get($site_id);
		}

		if(!isset($site->last_completed_session) || is_null($site->last_completed_session)) {
			// no session
			return;
		}

		Sqlite3Db::setSessionId($site->last_completed_session);

		if(is_null($session)) {
			$session = new CrawlSession;
			$session->get($site->last_completed_session);
		}

		$s3_bucket = SyncConfig::getInstance()["s3_bucket"];
		$sqlite_path_prefix = dirname($session->sqlite_path);

		DataConfig::getInstance()["sqlite_path"] = sprintf("/mnt/site_auditor_data/%s/%s",$s3_bucket,$sqlite_path_prefix);
		DataConfig::getInstance()["sqlite_read_only"] = true;

		Log::info("path: ".DataConfig::getInstance()["sqlite_path"]);
		Log::info("session: ".Sqlite3Db::$session_id);

		try {
			// if this throws, the sqlite db doesn't exist in local filesystem
			new SqlitePage;

		} catch(\RavenTools\SiteAuditorData\FileNotFoundException $e) {

			// so it doesn't exist, request it
	        $c = new DbFile;

			// session is incomplete
			if(!isset($session->sqlite_path) || empty($session->sqlite_path)) {
				// TODO handle incomplete sessions
				return;
			}

			Log::info(sprintf("requesting sqlite %s",$session->sqlite_path));

			try {

				$c->request([
					'key' => $session->sqlite_path
				]);

				response()->json([
					"status" => "requested"
				])->send();

				// TODO replace this with something safe for unit tests
				die();

			} catch(\SiteAuditorSync\FileNotFoundException $e) {

				Log::error("sqlite not found");
			}
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
