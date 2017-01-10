# installs 3rd party libs via composer
bash "install-composer-libs" do
	cwd release_path
	code <<-EOH
	composer install
	EOH
end

# install karma and jasmine through npm
npm_packages = ['karma', 'jasmine', 'requirejs', 'karma-jasmine', 'karma-requirejs', 'karma-phantomjs-launcher']

npm_packages.each do |d|
	execute "npm install -g #{d}" do
		cwd release_path
		user "root"
	end
end

# install js dependencies through bower
bash "Bower Install" do
	cwd release_path
	code <<-EOH
	bower install --allow-root
	EOH

	case node[:standalone_site_auditor][:config_env]
	when "vagrant", "vagrantstaging"
		user "vagrant"
		environment "HOME" => "/home/vagrant"
	end
end

file "#{release_path}/.env" do
	content <<-EOH
CONFIG_ENV=#{node[:standalone_site_auditor][:config_env]}
HOME=/var/www
EOH
end

if ["production","staging"].include? node[:standalone_site_auditor][:config_env] 
	# only run for production and staging
	bash "Update storage directory permissions" do
		code <<-EOH
		chown -R apache: "#{release_path}/storage"
		EOH
	end
end
