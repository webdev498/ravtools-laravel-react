#!/bin/bash

deploy_dir='/home/webapps/site_auditor'
# install 3rd party cookbooks
cd $deploy_dir
mkdir -p cache
berks vendor 
