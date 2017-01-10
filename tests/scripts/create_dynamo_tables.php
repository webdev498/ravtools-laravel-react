<?php

namespace RavenTools\SiteAuditorData;

require_once(sprintf("%s/../../bootstrap/data.php",__DIR__));

$models = [
	"Account", "AccountService", "CrawlSession", "PathExclusion", "Package", "Service", "Site", "User", "Share"
];

foreach($models as $model) {
	$model = sprintf('RavenTools\SiteAuditorData\%s',$model);
	$m = new $model;
}
