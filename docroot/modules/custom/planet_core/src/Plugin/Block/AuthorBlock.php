<?php

namespace Drupal\planet_core\Plugin\Block;

use Drupal\Component\DependencyInjection\ContainerInterface;
use Drupal\Core\Block\BlockBase;
use Drupal\Core\Block\BlockPluginInterface;
use Drupal\Core\File\FileUrlGeneratorInterface;
use Drupal\file\FileInterface;
use Drupal\media\MediaInterface;
use Drupal\node\Entity\Node;
use Drupal\file\Entity\File;
use Drupal\media\Entity\Media;

/**
 * Provides an 'Author Block' block.
 *
 * @Block(
 *   id = "author_block",
 *   admin_label = @Translation("Author Block"),
 *   category = @Translation("Custom Blocks"),
 * )
 */

class AuthorBlock extends BlockBase implements BlockPluginInterface {

  /**
   * @var \Drupal\Core\File\FileUrlGeneratorInterface
   */
  protected $fileUrlGenerator;

  /**
   * Creates a HelpBlock instance.
   *
   * @param array $configuration
   *   A configuration array containing information about the plugin instance.
   * @param string $plugin_id
   *   The plugin_id for the plugin instance.
   * @param mixed $plugin_definition
   *   The plugin implementation definition.
   * @param \Drupal\Core\File\FileUrlGeneratorInterface $file_generator
   *   File generator.
   */
  public function __construct(array $configuration, $plugin_id, $plugin_definition, FileUrlGeneratorInterface $file_generator) {
    parent::__construct($configuration, $plugin_id, $plugin_definition);
    $this->fileUrlGenerator = $file_generator;
  }


  /**
   * {@inheritdoc}
   */
  public static function create(ContainerInterface $container, array $configuration, $plugin_id, $plugin_definition) {
    return new static(
      $configuration,
      $plugin_id,
      $plugin_definition,
      $container->get('file_url_generator'),
    );
  }


    /**
     * {@inheritdoc}
     */
    public function build() {
      // Get the current node, assuming it's an article.
      $node = \Drupal::routeMatch()->getParameter('node');

      if ($node instanceof Node && $node->getType() == 'resources') {
        // Get the author ID from the field_author field.
        $author_id = $node->get('field_author')->target_id;

        if ($author_id) {
          // Load the author node.
          $author = Node::load($author_id);
          if ($author instanceof Node && $author->getType() == 'author') {

            // Extract author information.
            $author_name = $author->getTitle() ? $author->getTitle() : "";
            $mid = $author->get('field_profile_picture')->getValue()[0]['target_id'];
            $media = Media::load($mid);
            $fid = $media->field_media_image->target_id;
            $file = File::load($fid);
            $url = $this->fileUrlGenerator->generateAbsoluteString($file->getFileUri());

            // Build the block content for the existing author.
            $build = [
              '#markup' => $this->t('<div class="author-@author_class linked-author-page"><div>
                  <img src="@photo_url" alt="@author_name">
                </div>
                <div>
                  <a class="author-name" href="@author_url">by @author_name</a>
                </div></div>', [
                '@photo_url' => $url,
                '@author_name' => $author_name,
                '@author_url' => $author->toUrl()->toString(),
                '@author_class' => strtolower(str_replace(' ', '-', $author_name)),
              ]),
            ];

            return $build;
          }
        } else {
          // If author_id does not exist, use legacy author information.


          $legacy_author_name = $node->get('field_resources_author')->value;

          $profile_photo_media = $node->get('field_resources_author_photo')->entity;

          if ($profile_photo_media instanceof MediaInterface) {
            $profile_photo_file = $profile_photo_media->get('field_media_image')->entity;

            if ($profile_photo_file instanceof FileInterface) {
              $profile_photo_url = $this->fileUrlGenerator->generateAbsoluteString($profile_photo_file->getFileUri());
            }
          }

          $build = [
            '#markup' => $this->t('<div class="author-@author_class linked-author-page"><div>
                <img src="@photo_url" alt="@author_name">
              </div>
              <div>
                <span class="author-name">by @author_name</span>
              </div></div>', [
              '@photo_url' => $profile_photo_url,
              '@author_name' => $legacy_author_name,
              '@author_class' => strtolower(str_replace(' ', '-', $legacy_author_name)),
            ]),
          ];

          return $build;

        }
      }

      // If the block doesn't apply to the current node, return empty content.
      return [
        '#markup' => ''
      ];
    }

    public function getCacheMaxAge() {
      return 0;
    }

}
