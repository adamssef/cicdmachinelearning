<?php

namespace Drupal\planet_event_pages\Controller;

use Symfony\Component\HttpFoundation\JsonResponse;

class PlanetEventPagesController {

  public function loadEvents($limit = 10, $offset = 0): JsonResponse {
    try {
      // Basic validation.
      if (!is_numeric($limit) || !is_numeric($offset)) {
        return new JsonResponse(['error' => 'Invalid limit or offset'], 400);
      }

      // Fetch events.
      $eventService = \Drupal::service('planet.event_pages_service');
      $events = $eventService->getAllEvents((int)$limit, (int)$offset);

      return new JsonResponse($events);

    } catch (\Throwable $e) {
      // Log error and return 500.
      \Drupal::logger('planet_event_pages')->error($e->getMessage());
      return new JsonResponse(['error' => $e->getMessage()], 500);
    }
  }
}
