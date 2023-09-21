<?php
namespace Drupal\planet_language_switcher\Plugin\Block;


use Drupal\Core\Block\BlockBase;
use Drupal\Core\Block\BlockPluginInterface;
use Drupal\node\Entity\Node;
use Drupal\file\Entity\File; // Add this line at the top of your file.
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
        if (!empty($author_id)) {
          // Load the author node.
          $author = Node::load($author_id);
          if ($author instanceof Node && $author->getType() == 'author') {

            // Extract author information.
            $author_name = $author->getTitle();
            $author_url = $author->toUrl()->toString();
            $mid = $author->get('field_photo')->getValue()[0]['target_id'];

            $media = Media::load($mid);
            $fid = $media->field_media_image->target_id;
            $file = File::load($fid);

            $url = file_create_url($file->getFileUri()); // Use file_create_url() to get the file URL

            // Build the block content.
            $build = [
              '#markup' => $this->t('<div class="linked-author-page"><div>
                  <img src="@photo_url" alt="@author_name">
                </div>
                <div>
                  <a class="author-name" href="@author_url">By @author_name</a>
                </div></div>', [
                '@photo_url' => $url,
                '@author_name' => $author_name,
                '@author_url' => $author_url,
              ]),
            ];
  
            return $build;
          }
        }
      }
  
      // If the block doesn't apply to the current node, return empty content.
      return [
        '#markup' => ''
      ];
    }
  }
  