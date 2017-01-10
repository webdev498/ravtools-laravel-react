<?php

require_once(sprintf("%s/%s",__DIR__,"../../bootstrap/data.php"));

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
		"table" => "account_features",
		"class" => "\RavenTools\SiteAuditorData\AccountFeature"
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
	]
];

foreach($dynamo_tables as $table) {

	$name = $table['table'];
	$class = $table['class'];

	$ob = new $class;

	printf("clearing %s\n", $name);

	foreach($ob->find() as $record) {
		printf("deleting object id %s...\n", $record->id);
		$record->delete();
	}
}