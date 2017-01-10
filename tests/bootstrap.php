<?php

require_once(sprintf("%s/../vendor/autoload.php",__DIR__));

// disable PagerDuty email sending
\RavenTools\Alerts\PagerDuty::$enabled = false;

require_once(sprintf("%s/../bootstrap/app.php",__DIR__));

// only init dynamodb if we're running the 'API Tests' test suite
if(array_search("API Tests",$_SERVER['argv']) > 0) {
	require_once(sprintf("%s/../bootstrap/data.php",__DIR__));

	// remove pages redis key
	$a = new \RavenTools\SiteAuditorData\Account();
	foreach($a->find() as $account) {
		\RavenTools\SiteAuditorData\RedisClient::get("storage")->del(
			sprintf("%s_pages",$account->id)
		);
	}

} elseif(array_search("Unit Tests",$_SERVER['argv']) > 0) {
	// don't try to create tables in unit tests
	\RavenTools\SiteAuditorData\Config::getInstance()['create_dynamo_tables'] = false;
}
