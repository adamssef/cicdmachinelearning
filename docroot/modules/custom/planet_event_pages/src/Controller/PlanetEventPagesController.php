<?php

namespace Drupal\planet_event_pages\Controller;

use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;

class PlanetEventPagesController {

  public function loadEvents(Request $request): JsonResponse {
    try {
      // Fetch query parameters.
      $limit = $request->query->get('limit', 9); // Default limit is 9.
      $offset = $request->query->get('offset', 0); // Default offset is 0.
      $locations = $request->query->get('locations', '');
      $categories = $request->query->get('categories', '');
      $searchTerm = $request->query->get('search', ''); // Retrieve search term.
      $langcode = $request->query->get('langcode', 'en'); // Retrieve search term.

      // Validate parameters.
      if (!is_numeric($limit) || !is_numeric($offset)) {
        return new JsonResponse(['error' => 'Invalid limit or offset'], 400);
      }

      // Validate search term length.
      if (strlen($searchTerm) > 0 && strlen($searchTerm) < 3) {
        return new JsonResponse(['error' => 'Search term must be at least 3 characters long'], 400);
      }

      // Convert the locations and categories into arrays (if provided).
      $locationArray = !empty($locations) ? explode(',', $locations) : [];
      $categoryArray = !empty($categories) ? explode(',', $categories) : [];

      // Fetch events from service.
      $eventService = \Drupal::service('planet.event_pages_service');
      
      // Call the service method with the search term.
      $events = $eventService->getAllEvents((int)$limit, (int)$offset, $locationArray, $categoryArray, $searchTerm, $langcode);

      // Return events as JSON response.
      return new JsonResponse($events);

    } catch (\Throwable $e) {
      // Log error and return 500 response.
      \Drupal::logger('planet_event_pages')->error($e->getMessage());
      return new JsonResponse(['error' => $e->getMessage()], 500);
    }
  }
}
