# find a free port for dynamodb
DYNAMODB_PORT := $(shell python -c 'import socket; s=socket.socket(); s.bind(("", 0)); print(s.getsockname()[1]); s.close()')

# default target: run unit and integration tests
test: unit integration

unit: composer_install
	phpunit --testsuite "Unit Tests"

integration: composer_install init_test_data
	DYNAMODB_PORT=$(DYNAMODB_PORT) phpunit --testsuite "API Tests"

composer_install:
	composer install

start_local_dynamo:
	timeout 60 vendor/raventools/site_auditor_data/tests/scripts/local_dynamo.sh $(DYNAMODB_PORT) &>/dev/null &
	# insure dynamo is running before we continue
	until [ "ps -ef | grep 'DynamoDBLocal.jar.*$(DYNAMODB_PORT)'" ]; do sleep 1; done

init_test_data: start_local_dynamo
	DYNAMODB_PORT=$(DYNAMODB_PORT) php tests/scripts/init_test_data.php
