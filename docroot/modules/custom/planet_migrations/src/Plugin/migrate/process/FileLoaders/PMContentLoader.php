<?php
namespace Drupal\planet_migrations\Plugin\migrate\process\FileLoaders;

use Drupal\Core\File\FileSystemInterface;
use Drupal\file\Entity\File;
use Drupal\media\Entity\Media;
use Drupal\migrate\MigrateSkipRowException;
use Drupal\migrate\MigrateExecutableInterface;
use Drupal\migrate\Row;
use Drupal\node\Entity\Node;
use Drupal\path_alias\Entity\PathAlias;
use Drupal\planet_migrations\Plugin\migrate\process\AbstractProcessPluginBaseExtended;

/**
 * Migrates medias into existing nodes.
 *
 * @MigrateProcessPlugin(
 *   id = "pm_content_loader"
 * )
 */
class PMContentLoader extends AbstractProcessPluginBaseExtended {

  /**
   * {@inheritdoc}
   */
  public function transform($value, MigrateExecutableInterface $migrate_executable, Row $row, $destination_property) {
    // Log the message when the transformation begins.
    $this->logger->error('MediaLoader: transform() started');

    // Extract the file name from the file path.
    $value_exploded = explode('/', $value);
    $file_name = end($value_exploded);
    $current_year = date('Y');
    $current_month = date('m');
    $file_path = "public://$current_year-$current_month/" . $file_name;
    $this->logger->notice('File path: ' . $file_path);

    // Load the file entity by its file path.
    $file_ids = $this->entityTypeManager->getStorage('file')
      ->loadByProperties(['uri' => $file_path]);

    $this->logger->notice('File IDs: ' . print_r($file_ids, TRUE));

    // Check if the file exists in Drupal.
    // Check if the file entity already exists in Drupal.
    if (!$file_ids) {
      // Define the source path of the physical file.
      $source_path = DRUPAL_ROOT . '/resources/logos/payment_methods/images/' . $file_name;

      // Use the file system to copy the physical file to the Drupal-managed directory.
      $file_system = \Drupal::service('file_system');
      if (file_exists($source_path)) {
        try {
          // Ensure the target directory exists.
          $file_system->prepareDirectory(dirname($file_path), FileSystemInterface::CREATE_DIRECTORY);

          // Copy the file to the Drupal-managed directory.
          $file_system->copy($source_path, $file_path, FileSystemInterface::EXISTS_REPLACE);

          // Create a Drupal file entity.
          $file = File::create(['uri' => $file_path]);
          $file->save();

          $this->logger->notice('File entity created for: ' . $file_path . ' with ID: ' . $file->id());
          $file_ids = [$file];
        } catch (\Exception $e) {
          $this->logger->error('Failed to create file entity for: ' . $file_path . '. Error: ' . $e->getMessage());
        }
      } else {
        $this->logger->error('Source file does not exist: ' . $source_path);
      }
    } else {
      $this->logger->notice('File entity already exists for: ' . $file_path);
    }

    // Create media entity with the file.
    $file_id = reset($file_ids)->id();

    $media = Media::create([
      'bundle' => 'image',
      'field_media_image' => [
        'target_id' => $file_id,
      ],
    ]);

    $media->save();

    // Load the node ID (payment_methods type) by its title.
    $title = $row->getSource()['title'];
    $nid = $this->nodeService->getNodeIdByTitleAndContentType($title, 'payment_methods');

    if (!$nid) {
      $this->logger->error('No node found with title: ' . $title);
      throw new MigrateSkipRowException(); // Skip the row if no node is found.
    }

    $node = Node::load($nid);

    // Set the media field only if it's empty.
    if ($node->get('field_logo_media')->isEmpty()) {
      $node->set('field_logo_media', $media->id());
      $node->save();
    }

    // Save channels.
    $channels_raw = $row->getSource()['channel'];
    $channels_arr = explode(' ', $channels_raw);

    if ($channels_arr && !empty($channels_arr)) {
      foreach ($channels_arr as $channel) {
        $channel_ids[] = $this->taxonomyService
          ->getTermIdByTermName($channel, 'channels');
      }

      $node->set('field_payment_channels', $channel_ids);

      $alias_string = strtolower(str_replace('-', ' ', $title));
      $alias_string = str_replace('  ', '-', $alias_string);
      $alias_string = str_replace(' ', '-', $alias_string);
      $alias_string = str_replace('Ü', 'u', $alias_string);
      $alias_string = str_replace('--', '-', $alias_string);
      $alias_string = str_replace('e-finance', 'efinance', $alias_string);

      // Any aliases from prev migration attempts? Delete them first.
      $this->deleteAliases('/payment-methods/' . $alias_string, 'en', $alias_string);

      $path_alias = PathAlias::create([
        'path' => '/node/' . $node->id(),
        'alias' => '/payment-methods/' . $alias_string,
        'langcode' => 'en'
      ]);
      $path_alias->save();

      $translation_langcodes = ['es', 'de', 'fr', 'it'];
      $alias_patterns = [
        'es' => '/metodos-pago/',
        'de' => '/zahlungsarten/',
        'it' => '/metodi-di-pagamento/',
        'fr' => '/methodes-paiement/',
      ];

      foreach ($translation_langcodes as $langcode) {
        $translated_node = $node->addTranslation($langcode, $node->toArray());

        // Create the path alias for the translation, without the language prefix
        if (isset($alias_patterns[$langcode])) {

          try {
            // Any aliases from prev migration attempts? Delete them first.
            $this->deleteAliases($alias_patterns[$langcode] . $alias_string, $langcode, $alias_string);

            $translation_alias = PathAlias::create([
              'path' => '/node/' . $translated_node->id(),
              'alias' => $alias_patterns[$langcode] . $alias_string,
              'langcode' => $langcode,
            ]);
            $translation_alias->save();
          } catch (\Exception $e) {
            $this->logger->error('Failed to create path alias for translation: ' . $e->getMessage());
          }

        }

        $node->save();
      }

      // Save payment method.
      $payment_method_raw = $row->getSource()['category'];
      $method_id = $this->taxonomyService
        ->getTermIdByTermName($payment_method_raw, 'payment_methods');

      $node->set('field_payment_method', $method_id);
      $node->save();

      // Save acquirers.
      $acquirers_raw = $row->getSource()['acquirers'];

      if ($acquirers_raw && !empty(trim($acquirers_raw))) {
        $acquirers_array = explode(PHP_EOL, $acquirers_raw);
        $term_ids = [];

        foreach ($acquirers_array as $acquirer) {
          $acquirer = trim($acquirer); // Ensure no empty strings or spaces.

          if (!empty($acquirer) && $acquirer !== 'Acquirer') {
            // Load or create the taxonomy term by name.
            $term_id = $this->taxonomyService->getTermIdByTermName($acquirer, 'acquirers');

            if (!$term_id) {
              // Create a new term only if it doesn't exist.
              $term = $this->entityTypeManager->getStorage('taxonomy_term')
                ->create([
                  'name' => $acquirer,
                  'vid' => 'acquirers',
                ]);

              try {
                $term->save();
                $term_id = $term->id();
                $this->logger->notice('Created new term: ' . $acquirer);
              }
              catch (\Exception $e) {
                $this->logger->error('Failed to create term: ' . $acquirer . ' with error: ' . $e->getMessage());
                continue; // Skip to the next acquirer on failure.
              }
            }

            // Add the term ID to the list of term IDs to associate with the node.
            if ($term_id) {
              $term_ids[] = $term_id;
            }
          }
          else {
            $this->logger->warning('Skipped empty acquirer in row for node: ' . $node->label());
          }
        }

        // Associate the taxonomy terms with the node if any terms were found or created.
        if (!empty($term_ids)) {
          $node->set('field_payment_methods_acquirers', $term_ids);
          $node->save();
        }
        else {
          $this->logger->warning('No valid acquirers found for node: ' . $node->label());
        }
      }
      else {
        $this->logger->notice('No acquirers data found for node: ' . $node->label());
      }

      $this->logger->notice('MediaLoader: transform() completed for node: ' . $node->label());
    }
  }

  private function deleteAliases(string $alias_string, $langcode = 'en', $alias_base = NULL) {
    $alias_storage = $this->entityTypeManager->getStorage('path_alias');
    $aliases = $alias_storage->loadByProperties(['alias' => $alias_string]);

    $this->logger->notice($alias_base ?? 'No alias base provided');

    if (!empty($aliases)) {
      $this->logger->notice("Number of junk translations to be removed for $alias_string: " .  count($aliases));

      foreach ($aliases as $alias) {
        $alias->delete();
      }

    } else {
      $this->logger->warning('No alias found for @alias_string', ['@alias_string' => $alias_string]);
    }
  }

}