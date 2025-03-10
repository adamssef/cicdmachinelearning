<?php

namespace Drupal\planet_core;

use Drupal\webform\WebformSubmissionInterface;

/**
 * Helper class for handling UTM parameters in webform submissions.
 */
class UTMHelper {

  /**
   * List of UTM parameters to track.
   *
   * @var array
   */
  protected static $utmParameters = [
    'utm_source',
    'utm_medium',
    'utm_campaign',
    'utm_term',
    'utm_content',
    'orig_utm_source',
    'orig_utm_medium',
    'orig_utm_campaign',
    'orig_utm_term',
    'orig_utm_content',
    'gclid',
    'referrer',
    'orig_lp',
  ];

  /**
   * Processes a webform submission to add UTM parameters from cookies.
   *
   * @param \Drupal\webform\WebformSubmissionInterface $webform_submission
   *   The webform submission being processed.
   */
  public static function processSubmission(WebformSubmissionInterface $webform_submission): void {
    // Process all standard UTM parameters
    foreach (self::$utmParameters as $param) {
      $cookie_name = 'Drupal_visitor_' . $param;
      $param_value = self::getCookieValue($cookie_name);
      
      if (!empty($param_value)) {
        $webform_submission->setElementData($param, $param_value);
      }
    }
  }

  /**
   * Gets a sanitized cookie value if it exists.
   *
   * @param string $cookie_name
   *   The name of the cookie to retrieve.
   *
   * @return string
   *   The sanitized cookie value, or an empty string if not set.
   */
  protected static function getCookieValue(string $cookie_name): string {
    return isset($_COOKIE[$cookie_name]) ? self::sanitizeCookie($_COOKIE[$cookie_name]) : '';
  }

  /**
   * Sanitizes cookie values.
   *
   * @param string $cookie_value
   *   The cookie value to sanitize.
   *
   * @return string
   *   The sanitized cookie value.
   */
  public static function sanitizeCookie(string $cookie_value): string {
    // Implement your sanitization logic here
    return filter_var($cookie_value, FILTER_SANITIZE_STRING);
  }
}