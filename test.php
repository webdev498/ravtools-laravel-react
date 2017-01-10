<?php

require_once("bootstrap/data.php");

use RavenTools\SiteAuditorData\Account;
use RavenTools\SiteAuditorData\AccountService;
use RavenTools\SiteAuditorData\AccountFeature;
use RavenTools\SiteAuditorData\IssueExclusion;
use RavenTools\SiteAuditorData\PathExclusion;
use RavenTools\SiteAuditorData\Share;
use RavenTools\SiteAuditorData\Service;
use RavenTools\SiteAuditorData\Site;
use RavenTools\SiteAuditorData\User;

switch($argv[1]) {
	case "dumpusers":
		$u = new User();
		$users = $u->find();
		foreach($users as $user) {
			echo $user;
		}
		break;
	case "dumpsites":
		$s = new Site();
		$sites = $s->find();
		foreach($sites as $site) {
			echo $site;
		}
		break;
	case "dumpaccounts":
		$a = new Account();
		$accounts = $a->find();
		foreach($accounts as $account) {
			echo $account;
		}
		break;
	case "dumpservices":
		$a = new Service;
		$services = $a->find();
		foreach($services as $service) {
			echo $service;
		}
		break;
	case "dumpaccountservices":
		$a = new AccountService;
		$accountservices = $a->find();
		foreach($accountservices as $accountservice) {
			echo $accountservice;
		}
		break;
	case "dumpissueexclusions":
		$i = new IssueExclusion;
		$items = $i->find();
		foreach($items as $item) {
			echo $item;
		}
		break;
	case "dumppathexclusions":
		$i = new PathExclusion;
		$items = $i->find();
		foreach($items as $item) {
			echo $item;
		}
		break;
	case "dumpshares":
		$i = new Share;
		$items = $i->find();
		foreach($items as $item) {
			echo $item;
		}
		break;
	case "dumpaccountfeatures":
		$i = new AccountFeature;
		$items = $i->find();
		foreach($items as $item) {
			echo $item;
		}
		break;
}
