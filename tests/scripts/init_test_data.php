<?php

require_once(sprintf("%s/%s",__DIR__,"../../bootstrap/app.php"));

\RavenTools\Alerts\PagerDuty::$enabled = false;

require_once(sprintf("%s/%s",__DIR__,"../../bootstrap/data.php"));

use \RavenTools\SiteAuditorData\Config as DataConfig;
use \RavenTools\SiteAuditorData\Sqlite3Db;

Sqlite3Db::$session_id = "dev";

$dynamo_tables = [
	[
		"table" => "sites",
		"class" => "\RavenTools\SiteAuditorData\Site"
	],
	[
		"table" => "accounts",
		"class" => "\RavenTools\SiteAuditorData\Account"
	],
	[
		"table" => "users",
		"class" => "\RavenTools\SiteAuditorData\User"
	],
	[
		"table" => "account_services",
		"class" => "\RavenTools\SiteAuditorData\AccountService"
	],
	[
		"table" => "services",
		"class" => "\RavenTools\SiteAuditorData\Service"
	],
	[
		"table" => "packages",
		"class" => "\RavenTools\SiteAuditorData\Package"
	],
	[
		"table" => "features",
		"class" => "\RavenTools\SiteAuditorData\Feature"
	],
	[
		"table" => "package_features",
		"class" => "\RavenTools\SiteAuditorData\PackageFeature"
	],
	[
		"table" => "crawl_sessions",
		"class" => "\RavenTools\SiteAuditorData\CrawlSession"
	],
	[
		"table" => "path_exclusions",
		"class" => "\RavenTools\SiteAuditorData\PathExclusion"
	],
	[
		"table" => "shares",
		"class" => "\RavenTools\SiteAuditorData\Share"
	],
	[
		"table" => "cancels",
		"class" => "\RavenTools\SiteAuditorData\Cancel"
	]
];

foreach($dynamo_tables as $table) {

	$name = $table['table'];
	$class = $table['class'];

	$fixture_path = sprintf("%s/../fixtures/%s.json",__DIR__,$name);

	if(is_null($data = json_decode(file_get_contents($fixture_path),true))) {
		printf("could not find fixture data for %s [%s]\n",$name,$fixture_path);
		exit(1);
	}

	foreach($data as $item) {

		$ob = new $class();

		if($ob->get($item['id']) === false) {
			// object doesn't already exist, create and save it
			$ob->set($item);

			if($ob->save() === false) {
				die("failed to save object to dynamo table [$name]\n");
			}
		}
	}
}
