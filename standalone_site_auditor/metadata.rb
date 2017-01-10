name			 'standalone_site_auditor'
maintainer		 'YOUR_COMPANY_NAME'
maintainer_email 'YOUR_EMAIL'
license			 'All rights reserved'
description		 'Installs/Configures standalone_site_auditor'
long_description IO.read(File.join(File.dirname(__FILE__), 'README.md'))
version			 '0.1.0'

depends "raven-deploy"
depends "raven-php"
depends "raven-nodejs"

recipe "standalone_site_auditor::default", "installs application dependencies"
recipe "standalone_site_auditor::deploy_tag", "deploys the grid application"
recipe "standalone_site_auditor::vagrant", "configures the application on vagrant"

attribute "standalone_site_auditor",
	:display_name => "Site Auditor Grid",
	:type => "hash"

attribute "standalone_site_auditor/app_path",
	:display_name => "Application Path",
	:description => "Path where application is checked out. Will have 'current' appended",
	:required => "recommended",
	:type => "string",
	:recipes => ["standalone_site_auditor::deploy_tag"],
	:default => "/home/webapps/standalone_site_auditor"

attribute "standalone_site_auditor/repository",
	:display_name => "Application Repository",
	:description => "Repository in which the app resides",
	:required => "recommended",
	:type => "string",
	:recipes => ["standalone_site_auditor::deploy_tag"],
	:default => "git@github.com:raventools/standalone-site-auditor.git"

attribute "standalone_site_auditor/revision",
	:display_name => "Application Revision",
	:description => "Revision to check out",
	:required => "recommended",
	:type => "string",
	:recipes => ["standalone_site_auditor::deploy_tag"],
	:default => "master"

attribute "standalone_site_auditor/domains",
	:display_name => "Vhost Domains",
	:description => "Comma-separated list of domains the vhost should answer to",
	:required => "recommended",
	:type => "array",
	:recipes => ["standalone_site_auditor::deploy_tag"]

attribute "standalone_site_auditor/port",
	:display_name => "Vhost Port",
	:description => "HTTP listen port",
	:required => "recommended",
	:type => "string",
	:recipes => ["standalone_site_auditor::deploy_tag"],
	:default => "80"

attribute "standalone_site_auditor/config_env",
	:display_name => "Configuration Environment",
	:description => "Determines environment behavior such as which database tables and s3 buckets to use",
	:required => "recommended",
	:type => "string",
	:recipes => ["standalone_site_auditor::default","standalone_site_auditor::deploy_tag"],
	:default => "staging"
