#!/bin/bash

site="$1"
target_env="$2"
source_branch="$3"
deployed_tag="$4"
repo_url="$5"
repo_type="$6"


echo "maintenance_mode 1"
drush9 @$site.$target_env state:set system.maintenance_mode 1 --input-format=integer

echo "Scrubbing database"
drush9 @$site.$target_env sql-sanitize --sanitize-password="$(openssl rand -base64 32)" --yes

echo "drush cache-rebuild"
drush9 @$site.$target_env -y cr --strict=0

echo "drush updb"
drush9 @$site.$target_env -y updb --strict=0

echo "drush cim sync twice"
drush9 @$site.$target_env -y cim sync
drush9 @$site.$target_env -y cim sync

echo "drush cache-rebuild"
drush9 @$site.$target_env -y cr --strict=0

echo "maintenance_mode 0"
drush9 @$site.$target_env state:set system.maintenance_mode 0 --input-format=integer
