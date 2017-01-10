#!/bin/bash

export PATH=/opt/chefdk/bin:/opt/chefdk/embedded/bin:$PATH

deploy_dir='/vagrant'
data_bags_bucket='raven-deploy'

# grab jq utility if we don't have it already
if [ ! -f /usr/bin/jq ]; then
	wget -qO /usr/bin/jq https://github.com/stedolan/jq/releases/download/jq-1.5/jq-linux64
	chmod 755 /usr/bin/jq
fi

# set environment so aws cli will work
export AWS_ACCESS_KEY_ID=`jq .raven_deploy.aws_key < $deploy_dir/overrides.json | xargs -n1`
export AWS_SECRET_ACCESS_KEY=`jq .raven_deploy.aws_secret < $deploy_dir/overrides.json | xargs -n1`
export AWS_DEFAULT_REGION="us-east-1"

# get data bags
mkdir -p .chef
aws s3 sync s3://$data_bags_bucket/.chef/ /etc/chef/
aws s3 sync s3://$data_bags_bucket/data_bags/ /var/chef/data_bags/
aws s3 sync s3://$data_bags_bucket/ /root/.ssh/ --exclude "*" --include known_hosts

if ! gem list -i knife-solo &>/dev/null; then
	gem install --no-user-install knife-solo knife-solo_data_bag --no-ri --no-rdoc
fi

cd $deploy_dir

mkdir -p /root/.ssh

cd /var/chef

# loop over deploy key items and write them
knife solo data bag show deploy_keys \
	-F json \
	2>/dev/null \
	| jq '.|keys[]' | xargs -n1 \
| while read app; do 

	key_path=/root/.ssh/$app-deploy.key

	if [ ! -f $key_path ]; then
		knife solo data bag show deploy_keys $app \
			-F json \
			2>/dev/null \
			| jq '.private_key' \
			| xargs -n1 | sed 's/\\n/\n/g' \
		> $key_path
		chmod 600 $key_path
	fi

	if ! grep $key_path /root/.ssh/config &>/dev/null; then
		cat <<EOH >> /root/.ssh/config
Host github-$app
	User git
	Hostname github.com
	IdentityFile $key_path

EOH
	fi

done
