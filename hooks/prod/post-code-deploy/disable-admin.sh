#!/bin/bash
#
# Cloud Hook: disable-admin
#
# Ensure Admin is disabled

site="$1"
target_env="$2"

drush9 @$site.$target_env -y ublk 1
