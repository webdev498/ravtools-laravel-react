# checkout directory. expect current/ to be appended
default[:standalone_site_auditor][:app_path] = "/home/webapps/standalone_site_auditor"

# github repo
default[:standalone_site_auditor][:repository] = "git@github.com:raventools/standalone-site-auditor.git"

# branch/tag/has to check out
default[:standalone_site_auditor][:revision] = "master"

# relative paths are appended to app_path/current; absolute paths are accepted as well
default[:standalone_site_auditor][:docroot] = "public"

# domains this vhost answers to.  first one is ServerName, subsequent ones are ServerAlias
default[:standalone_site_auditor][:domains] = ["localhost","standalone-site-auditor.site","standalone_site_auditor.site"]

# http listen port
default[:standalone_site_auditor][:port] = 80

# environment in which the app is running
default[:standalone_site_auditor][:config_env] = "vagrant"
