<?php

namespace Drupal\planet_ab_tests\Middleware;

use Symfony\Component\HttpFoundation\Cookie;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\HttpKernel\HttpKernelInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Exception\HttpExceptionInterface;

/**
 * Class PlanetCookieRedirectMiddleware
 *
 * @package Drupal\planet_ab_tests\Middleware
 */
class PlanetCookieRedirectMiddleware implements HttpKernelInterface {

  protected $app;

  /**
   * PlanetCookieRedirectMiddleware constructor.
   *
   * @param \Symfony\Component\HttpKernel\HttpKernelInterface $app
   */
  public function __construct(HttpKernelInterface $app) {
    $this->app = $app;
  }

  /**
   * {@inheritdoc}
   */
  public function handle(Request $request, $type = self::MAIN_REQUEST, $catch = true): Response {
    if ($request->getPathInfo() === '/') {
      $cookieName = 'homepage_ab_test';
      $random_int = mt_rand(1, 2);

      $existing_cookie_value = $request->cookies->get($cookieName);
      if (!$existing_cookie_value) {
        $cookie = new Cookie($cookieName, $random_int, strtotime('+1 year'), '/');
        if ($random_int === 1) {
          $response = new RedirectResponse('/new', 302);
          $response->headers->setCookie($cookie);
          return $response;
        }
        else {
          $response = $this->app->handle($request);
          $response->headers->setCookie($cookie);
          return $response;
        }
      } else {
        if ($existing_cookie_value === '1') {
          return new RedirectResponse('/new', 302);
        }
      }
    }

    try {
      $response = $this->app->handle($request, $type, $catch);
    } catch (HttpExceptionInterface $e) {
      throw $e;
    } catch (\Exception $e) {
      throw new \RuntimeException('An unexpected error occurred.', 0, $e);
    }

    return $response;
  }
}
