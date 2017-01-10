<?php

require_once('vendor/autoload.php');
require_once('bootstrap/data.php');

use \RavenTools\SiteAuditorData\User;

$email = "phil@raventools.com";

$user = new User;

$user->email = $email;
$user->status = 1;

$user->save();

unset($user);

$user = new User;

$u = $user->find([
	'keymap' => ['#STAT' => 'status'],
	'values' => [
		':email' => ['S' => $email],
		':status' => ['N' => '1']
	],
	'conditions' => 'email = :email AND #STAT = :status'
]);

//$u = $user->find();

echo $u->current();
