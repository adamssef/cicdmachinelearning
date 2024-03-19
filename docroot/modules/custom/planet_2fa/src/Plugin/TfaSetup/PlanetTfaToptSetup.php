<?php

namespace Drupal\planet_2fa\Plugin\TfaSetup;

use Drupal\Core\Form\FormStateInterface;
use Drupal\Core\Link;
use Drupal\Core\Url;
use Drupal\tfa\Plugin\TfaSetup\TfaTotpSetup;

/**
 * TOTP setup class to setup TOTP validation.
 *
 * @TfaSetup(
 *   id = "planet_tfa_totp_setup",
 *   label = @Translation("Planet TFA TOTP Setup"),
 *   description = @Translation("Planet TFA TOTP Setup Plugin"),
 *   helpLinks = {
 *    "Google Authenticator (Android/iOS)" = "https://googleauthenticator.net",
 *    "Microsoft Authenticator (Android/iOS)" = "https://www.microsoft.com/en-us/security/mobile-authenticator-app",
 *    "Authy (Android/iOS/Desktop)" = "https://authy.com",
 *    "FreeOTP (Android/iOS)" = "https://freeotp.github.io",
 *    "GAuth Authenticator (Desktop)" = "https://github.com/gbraadnl/gauth",
 *    "Okta" = "https://www.okta.com/customer-identity/multi-factor-authentication/",
 *   },
 *   setupMessages = {
 *    "saved" = @Translation("Application code verified."),
 *    "skipped" = @Translation("Application codes not enabled.")
 *   }
 * )
 */
class PlanetTfaToptSetup extends TfaTotpSetup {

  /**
   * {@inheritdoc}
   */
  public function getSetupForm(array $form, FormStateInterface $form_state) {
    $help_links = $this->getHelpLinks();

    try {
      unset($help_links['Authy (Android/iOS/Desktop)']);
      unset($help_links['FreeOTP (Android/iOS)']);
      unset($help_links['GAuth Authenticator (Desktop)']);
      unset($help_links['Microsoft Authenticator (Android/iOS)']);
      unset($help_links['Google Authenticator (Android/iOS)']);
    } catch (\Exception $e) {
      // Do nothing.
    }

    $help_links['Okta (Android/iOS)'] = 'https://www.okta.com/customer-identity/multi-factor-authentication/';

    $items = [];
    foreach ($help_links as $item => $link) {
      $items[] = Link::fromTextAndUrl($item, Url::fromUri($link, ['attributes' => ['target' => '_blank']]));
    }

    $form['apps'] = [
      '#theme' => 'item_list',
      '#items' => $items,
      '#title' => $this->t("Install authentication code application on your mobile device using <a href='{$help_links['Okta (Android/iOS)']}' class='plnt-okta-verify-tfa-setup'>Okta Verify</a> app"),
    ];
    $form['info'] = [
      '#type' => 'html_tag',
      '#tag' => 'p',
      '#value' => $this->t('The two-factor authentication application will be used during this setup and for generating codes during regular authentication. If the application supports it, scan the QR code below to get the setup code otherwise you can manually enter the text code.'),
    ];
    $form['seed'] = [
      '#type' => 'textfield',
      '#value' => $this->seed,
      '#disabled' => TRUE,
      '#description' => $this->t('Enter this code into your two-factor authentication app or scan the QR code below.'),
    ];

    // QR image of seed.
    $form['qr_image'] = [
      '#prefix' => '<div class="tfa-qr-code"',
      '#theme' => 'image',
      '#uri' => $this->getQrCodeUri(),
      '#alt' => $this->t('QR code for TFA setup'),
      '#suffix' => '</div>',
    ];

    // QR code css giving it a fixed width.
    $form['page']['#attached']['html_head'][] = [
      [
        '#tag' => 'style',
        '#value' => ".tfa-qr-code { width:200px }",
      ],
      'qrcode-css',
    ];

    // Include code entry form.
    $form = $this->getForm($form, $form_state);
    $form['actions']['login']['#value'] = $this->t('Verify and save');
    // Alter code description.
    $form['code']['#description'] = $this->t('A verification code will be generated after you scan the above QR code or manually enter the setup code. The verification code is six digits long.');
    return $form;
  }
}