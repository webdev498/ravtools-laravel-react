# gets us ready for deployments. installs deploy keys, creates directories
include_recipe "raven-deploy"

# installs and configures php
include_recipe "raven-php"

# installs and configures nodejs
include_recipe "raven-nodejs"

# installs bower for composing js dependencies
include_recipe "raven-nodejs::install_bower"
