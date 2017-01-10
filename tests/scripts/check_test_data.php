<?php

require_once(sprintf("%s/%s",__DIR__,"../../vendor/autoload.php"));

$dynamo_port = getenv("DYNAMO_PORT");
$sqlite_path = getenv("SQLITE_PATH"); 

$error = false;

system("netstat -lnp | grep ':$dynamo_port .*java' &>/dev/null",$exit_code);
if($exit_code !== 0) {
	printf("dynamodb is not running\n");
	$error = true;
}

if(!file_exists($sqlite_path)) {
	printf("missing sqlite file %s\n",$sqlite_path);
	$error = true;
}

if($error === true) {
	exit(1);
}
