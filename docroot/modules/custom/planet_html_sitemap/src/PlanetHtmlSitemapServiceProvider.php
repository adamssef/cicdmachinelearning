<?php

namespace Drupal\planet_html_sitemap;

use Drupal\Core\DependencyInjection\ContainerBuilder;
use Drupal\Core\DependencyInjection\ServiceProviderBase;
use Symfony\Component\DependencyInjection\Reference;

/**
 * Modifies the service simple_sitemap.form_helper.
 */
class PlanetHtmlSitemapServiceProvider extends ServiceProviderBase {

  /**
   * {@inheritdoc}
   */
  public function alter(ContainerBuilder $container) {

      if ($container->hasDefinition('simple_sitemap.form_helper')) {
        $definition = $container->getDefinition('simple_sitemap.form_helper');
        $definition->setClass('Drupal\planet_html_sitemap\Form\CustomFormHelper')
          ->addArgument(new Reference('current_route_match'));;
      }
    }

}
