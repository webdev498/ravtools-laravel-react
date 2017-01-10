raven_deploy_app "standalone-site-auditor" do
	path node[:standalone_site_auditor][:app_path]
	docroot node[:standalone_site_auditor][:docroot]
	domains node[:standalone_site_auditor][:domains]
	port node[:standalone_site_auditor][:port]
end

service "supervisord" do
	action :restart
end

sqlite_path = "tests/fixtures/dev.sqlite"
execute "php tests/scripts/init_test_data.php" do
	environment "SQLITE_PATH" => sqlite_path
	cwd node[:standalone_site_auditor][:app_path]
	not_if "php tests/scripts/check_test_data.php", :environment => { 
		"SQLITE_PATH" => sqlite_path
	}
end
