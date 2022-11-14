<?php

/**
 * @file
 * This file provides function to store common JS across all websites.
 */

/**
 * Create an array to update the common JS files.
 */
function lgpd_cookie_js_path() {

  return [
    LGPD_ONETRUST_COOKIE_BLOCKING_PERFORMANCE => [],
    LGPD_ONETRUST_COOKIE_BLOCKING_FUNCTIONAL => [],
    LGPD_ONETRUST_COOKIE_BLOCKING_TARGETTING => [],
    LGPD_ONETRUST_COOKIE_BLOCKING_MEDIA => [],
  ];

}
