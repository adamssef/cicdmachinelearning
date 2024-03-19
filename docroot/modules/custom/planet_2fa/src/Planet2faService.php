<?php

declare(strict_types = 1);

namespace Drupal\planet_2fa;

use Drupal\Core\Config\ConfigFactory;
use Drupal\Core\Messenger\MessengerTrait;
use Drupal\Core\Site\Settings;
use Drupal\Core\StringTranslation\StringTranslationTrait;
use Drupal\tfa\TfaLoginContextTrait;
use Drupal\tfa\TfaUserDataTrait;
use Drupal\tfa\TfaValidationPluginManager;
use Drupal\user\UserData;
use Psr\Log\LoggerInterface;

use Drupal\tfa\Plugin\TfaValidation;

/**
 * Planet Two-Factor Authentication service.
 *
 * It is useful to have some tfa related methods in a service class.
 */
class Planet2faService {

  use TfaLoginContextTrait;
  use TfaUserDataTrait;
  use StringTranslationTrait;
  use MessengerTrait;

  /**
   * User data service.
   *
   * @var \Drupal\user\UserData
   */
  protected $userData;

  /**
   * TFA settings config object.
   *
   * @var \Drupal\Core\Config\ImmutableConfig
   */
  protected $configFactory;

  /**
   * @var \Drupal\tfa\TfaValidationPluginManager $tfaValidationManager
   */
  protected $tfaValidationManager;

  /**
   * @var \Drupal\user\UserInterface
   */
  protected $user;

  /**
   * @var \Drupal\Core\Messenger\MessengerInterface
   */
  protected $messenger;

  /**
   * Constructs a new Planet2faService object.
   */
  public function __construct(UserData $userData, ConfigFactory $configFactory, TfaValidationPluginManager $tfa_validation_manager, $current_user, $messenger) {
    $this->userData = $userData;
    $this->tfaSettings = $configFactory->get('tfa.settings');
    $this->tfaValidationManager = $tfa_validation_manager;
    $this->user = $current_user;
    $this->messenger = $messenger;
  }

  /**
   * Check if the user can login without TFA.
   *
   * @return bool
   *   Return true if the user can login without TFA,
   *   otherwise return false.
   */
  public function canLoginWithoutTfa(LoggerInterface $logger) {
    // Get current user.
    $user =  $this->user;

    // Users that have configured a TFA method should not be allowed to skip.
    $user_settings = $this->userData->get('tfa', $user->id(), 'tfa_user_settings');
    $user_enabled_validation_plugins = $user_settings['data']['plugins'] ?? [];
    $enabled_validation_plugins = $this->tfaSettings->get('allowed_validation_plugins');
    $enabled_validation_plugins = is_array($enabled_validation_plugins) ? $enabled_validation_plugins : [];

    foreach ($this->tfaValidationManager->getDefinitions() as $plugin_id => $definition) {
      if (
        Settings::get('tfa.only_restrict_with_<enabled_plugins', FALSE) === TRUE
        && !array_key_exists($plugin_id, $enabled_validation_plugins)
      ) {
        continue;
      }

      if (array_key_exists($plugin_id, $user_enabled_validation_plugins)) {
        $plugin = $this->tfaValidationManager->createInstance($plugin_id, ['uid' => $user->id()]);

        if (!$plugin->ready()) {
          $message = $this->tfaSettings->get('help_text');
          $this->messenger()->addError($message);
          $logger->notice('@name has attempted login without using a configured second factor authentication plugin.', ['@name' => $user->getAccountName()]);

          return FALSE;
        }
      }
    }
    // User may be able to skip TFA, depending on module settings and number of prior attempts.
    $remaining = $this->remainingSkips();

    if ($remaining) {
      return TRUE;
    }

    // User can't login without TFA.
    return FALSE;
  }

  public function isTfaSetUp() {
    foreach ($this->tfaValidationManager->getDefinitions() as $plugin_id => $definition) {
      $plugin = $this->tfaValidationManager->createInstance($plugin_id, ['uid' => $this->user->id()]);

      if ($plugin instanceof TfaValidation\TfaTotpValidation) {
        return $plugin->ready();
      }
    }
  }

}
