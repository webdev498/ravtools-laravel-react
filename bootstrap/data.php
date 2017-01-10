<?php

require_once(sprintf("%s/../vendor/autoload.php",__DIR__));

use \RavenTools\SiteAuditorData\Config as DataModelConfig;
use \RavenTools\SiteAuditorData\DynamoDBClient;
use \App\Config;

$config_env = strtolower(getenv("CONFIG_ENV"));

switch($config_env) {
	default:
	case "vagrant":
		$port = getenv("DYNAMODB_PORT") ?: 8000;
		$credentials_path = sprintf("%s/.aws/credentials",getenv("HOME"));
		if(!file_exists($credentials_path)) {
			$credentials_path = "/var/www/.aws/credentials";
		}
		$dynamo = new \Aws\DynamoDb\DynamoDbClient([
			"credentials" => \Aws\Credentials\CredentialProvider::ini('default', $credentials_path),
			"region" => "us-east-1",
			"version" => "2012-08-10",
			"endpoint" => sprintf("http://127.0.0.1:%s/",$port)
		]);
		break;
	case "vagrantstaging":
		$dynamo = new \Aws\DynamoDb\DynamoDbClient([
			"credentials" => \Aws\Credentials\CredentialProvider::ini('default', '/var/www/.aws/credentials'),
			"version" => "2012-08-10",
			"region" => "us-east-1"
		]);
		break;
	case "staging":
		$dynamo = new \Aws\DynamoDb\DynamoDbClient([
			"version" => "2012-08-10",
			"region" => "us-east-1"
		]);
		break;
	case "production":
		$dynamo = new \Aws\DynamoDb\DynamoDbClient([
			"version" => "2012-08-10",
			"region" => "us-east-1"
		]);
		break;
}

DynamoDBClient::set($dynamo);
