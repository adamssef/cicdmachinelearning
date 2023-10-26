<?php

namespace Drupal\planet_core\Plugin\Block;

use Drupal\Core\Block\BlockBase;
use Drupal\Core\Block\BlockPluginInterface;
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
            $author_name = $author->getTitle();
            $mid = $author->get('field_profile_picture')->getValue()[0]['target_id'];
            $media = Media::load($mid);
            $fid = $media->field_media_image->target_id;
            $file = File::load($fid);
            $url = file_create_url($file->getFileUri());

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

          if ($profile_photo_media instanceof \Drupal\media\MediaInterface) {
            $profile_photo_file = $profile_photo_media->get('field_media_image')->entity;
            
            if ($profile_photo_file instanceof \Drupal\file\FileInterface) {
              $profile_photo_url = file_create_url($profile_photo_file->getFileUri());
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
}
