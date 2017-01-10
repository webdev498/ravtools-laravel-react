# -*- mode: ruby -*-
# vi: set ft=ruby :

overrides_json = File.dirname(__FILE__)+"/overrides.json"

VAGRANTFILE_API_VERSION = "2"

if ! Dir.exist?("berks-cookbooks") then
    Dir.mkdir("berks-cookbooks")
end

# configure vagrant
Vagrant.configure(VAGRANTFILE_API_VERSION) do |config|

	config.vm.box = "centos6-raven"
	config.vm.box_url = "http://raven-opensource.s3.amazonaws.com/boxes/centos6-raven.json"

	config.vm.network :private_network, ip: "10.55.0.10"

	config.vm.network :forwarded_port, guest: 80, host: 8088

	unless File.exists?(overrides_json)
		raise "Couldn't find #{overrides_json}. See overrides.json.example"
	end

	config_overrides = JSON.parse(IO.read(overrides_json))

	config.vm.synced_folder ".", "/vagrant"

	config.vm.synced_folder ".", "/home/webapps/site_auditor",
		type: "nfs"

	if config_overrides.has_key?('cookbook_dev_dir') and not config_overrides['cookbook_dev_dir'].nil? then
		config.vm.synced_folder config_overrides['cookbook_dev_dir'], "/development"
	end

	# download data bags
	config.vm.provision :shell, path: "scripts/data_bags.sh"

	# initial non-chef bootstrap
	config.vm.provision :shell, path: "scripts/vagrant_bootstrap.sh"

	config.vm.provision :chef_solo do |chef|
		chef.install = false
		chef.cookbooks_path = "berks-cookbooks"
		chef.roles_path = "roles"
		chef.add_role "vagrant"
		chef.json = config_overrides
	end

	config.vm.provider :virtualbox do |vb|
		vb.customize ["modifyvm", :id, "--rtcuseutc", "on", "--memory", "2048", "--cpus", "2", "--natdnshostresolver1", "on"]
	end
end
