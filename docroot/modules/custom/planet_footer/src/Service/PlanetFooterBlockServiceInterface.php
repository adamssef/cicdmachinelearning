<?php

namespace Drupal\planet_footer\Service;


/**
 * Provides an interface for classes that provides useful methods for working with programmatically created blocks.
 */
interface PlanetFooterBlockServiceInterface {


  /**
   * Prepares an array of menu content for the footer.
   *
   * @return array
   *   An array of menu content for the footer.
   */
  public function prepareLinksForFooter(): array;

  /**
   * Prepares an array of menu content for the legal section.
   *
   * @return array
   *   An array of menu content for the legal section.
   */
  public function prepareLinksForLegal(): array;

  /**
   * Prepares an array of menu content for the language switcher.
   *
   * [Note: This when SiteStudio is removed and Twig Tweak module enabled, this might not be needed any more.]
   *
   * @return array
   *   An array of menu content for the language switcher.
   */
  public function prepareDataForLanguageSwitcher():array;

}
