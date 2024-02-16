
# Intro
This project provides a platform base installation for Planet!!!!

# Installing a new website
## LOCAL SETUP
### Requirements
1. GIT, PHP, DOCKER, DOCKER-COMPOSE, COMPOSER and LANDO
2. Need access to the repository [planet](https://github.com/weareplanet/planet-lead-generation)

### GET STARTED
1. To start the new project run the following command:
  * Requirements:
  ** First we'll start the project in a new folder. Replace `<PROJECT>` by the project name right below.
  * Run the following command (remember to change `<PROJECT>` by your project name, e.g planet) `git clone https://bitbucket.org/ciandt_it/planet-payment.git`

2. Start the lando server:
  * Once you have downloaded the project run the script below.
  * cd `<PROJECT>`
  * The next step downloads and installs all the composer dependencies.
  * Set the settings-local.php if needed. Don't forget to insert your credentials when requested.
  * `lando start`

3. Import the database:
  * Download the database from the hosting server (acquia) and import into lando using: `lando db-import database-name.gz`

4. Having the installation finished, you can change the config folder location on `sites/default/settings.local.php`, if needed.
  * [Memcache] You can uncomment the lines (settings.local.php) that refers to Memcache config in order to enable the service.
  * By default Drupal inserts the database credentials settings on `settings.php` after installation, but this is not necessary since we already have those settings on `settings.local.php`.

4. Feel free to browse the website by accessing [https://`<PROJECT>`.lndo.site](https://`<PROJECT>`.lndo.site)

### Troubleshooting

1. If you're receiving a error message saying you don't have permission to ~/.composer/cache folder:
  * Check your composer folder permission `$ cd ~/.composer` and `$ls -la` if the permission of the folder cache is to root:root, run `sudo chown _replaceme_youruser:domain^users -R .composer`, please note you need to replace `_replaceme_youruser` with your linux user (e.g, user:domain^users). Now you should be good to go.

2. Give permissions to temp folder: (This is necessary once we don't have the
tmp config folder already configured on system.file.yml yet.)
  * `mkdir drupal/web/sites/default/files/tmp`
  * `lando drush cr -y`

3. If you wish to change the admin password run the following command:
  * `lando drush upwd admin 'admin'`

4. If an error occur when you attempt to `composer require`, you must give permissions.
  1. If you get => `Could not delete /app/drupal/web/sites/default/default.services.yml`
  2. Try => `sudo chmod 775 -R drupal/web/sites/default`
