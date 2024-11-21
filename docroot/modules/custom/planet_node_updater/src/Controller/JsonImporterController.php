<?php
namespace Drupal\planet_node_updater\Controller;

use Drupal\Core\Controller\ControllerBase;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Drupal\node\Entity\Node;
use Drupal\Core\File\FileSystemInterface;

/**
 * Returns responses for Planet node updater routes.
 */
final class JsonImporterController extends ControllerBase {

  protected $fileSystem;

  public function __construct(FileSystemInterface $fileSystem) {
    $this->fileSystem = $fileSystem;
  }

  public static function create(ContainerInterface $container) {
    return new static($container->get('file_system'));
  }

  public function importJsonDataForBlogContent() {
    $json_path = 'public://url_content_mapping.json';
    $json_data = json_decode(file_get_contents($this->fileSystem->realpath($json_path)), true);

    foreach ($json_data as $entry) {
      if (isset($entry['nid'], $entry['lang'], $entry['html'])) {
        $nid = $entry['nid'];
        $langcode = $entry['lang'];

        $node = Node::load($nid);
        if ($node && $node->hasTranslation($langcode)) {
          $translated_node = $node->getTranslation($langcode);
          $translated_node->set('field_html_content', [
            'value' => $entry['html'],
            'format' => 'cohesion',
          ]);
          $translated_node->save();
        }
      }
    }

    return new JsonResponse(['status' => 'Data imported successfully.']);
  }

  public function importJsonDataForProductContent() {
    $json_path = 'public://product_pages_content.json';
    $json_data = json_decode(file_get_contents($this->fileSystem->realpath($json_path)), true);

    foreach ($json_data as $entry) {
      if (isset($entry['nid'], $entry['lang'], $entry['html'])) {
        $nid = $entry['nid'];
        $langcode = $entry['lang'];

        $node = Node::load($nid);
        if ($node && $node->hasTranslation($langcode)) {
          $node->set('is_product_page', TRUE);
          $translated_node = $node->getTranslation($langcode);
          $translated_node->set('field_html_content', [
            'value' => $entry['html'],
            'format' => 'cohesion',
          ]);
          $translated_node->save();
          $node->save();
        }
      }
    }

    return new JsonResponse(['status' => 'Data imported successfully.']);
  }

}
