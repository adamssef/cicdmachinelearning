#!/bin/bash
#
# Cloud Hook: post-code-deploy
#
# The post-code-deploy hook is run whenever you use the Workflow page to
# deploy new code to an environment, either via drag-drop or by selecting
# an existing branch or tag from the Code drop-down list. See
# ../README.md for details.
#
# Usage: post-code-deploy site target-env source-branch deployed-tag repo-url
#                         repo-type

site="$1"
target_env="$2"
source_branch="$3"
deployed_tag="$4"
repo_url="$5"
repo_type="$6"

echo "drush sync:import"
cd "/var/www/html/${site}.${target_env}/"
#find site_studio_components/global -iname "*.yml" -exec drush9 @$site.$target_env sync:import --overwrite-all --path=../{} \;
#find site_studio_components/planet -iname "*.yml" -exec drush9 @$site.$target_env sync:import --overwrite-all --path=../{} \;
find site_studio_components/import_acquia -iname "*.yml" -exec drush9 @$site.$target_env sync:import --overwrite-all --path=../{} \;

echo "drush cache-rebuild"
drush9 @$site.$target_env -y cr --strict=0
