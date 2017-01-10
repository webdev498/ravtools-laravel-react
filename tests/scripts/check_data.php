<?php
require_once(sprintf("%s/%s",__DIR__,"../../bootstrap/data.php"));

$service = new \RavenTools\SiteAuditorData\Service;

$services = $service->find([
	'keymap' => [
		'#N' => 'name'
	],
	'values' => [
		':name' => [
			'S' => 'Site Auditor'
		]
	],
	'conditions' => '#N = :name'
]);

foreach($services as $service) {
	echo $service;
}