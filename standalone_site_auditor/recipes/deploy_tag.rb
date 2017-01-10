log "Attempting to deploy revision #{node[:standalone_site_auditor][:revision]}..."

# make sure all of our dependencies are set up
include_recipe "standalone_site_auditor::default"

raven_deploy_app "standalone-site-auditor" do
	path node[:standalone_site_auditor][:app_path]
	repository node[:standalone_site_auditor][:repository]
	revision node[:standalone_site_auditor][:revision]
	docroot node[:standalone_site_auditor][:docroot]
	domains node[:standalone_site_auditor][:domains]
	port node[:standalone_site_auditor][:port].to_i
end
