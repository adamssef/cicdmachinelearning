<?php
namespace Drupal\planet_payment_methods\Controller;

use Drupal\Core\Controller\ControllerBase;
use Drupal\planet_payment_methods\Service\PlanetPaymentMethodsService;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Symfony\Component\HttpFoundation\JsonResponse;

class PaymentMethodsController extends ControllerBase {

  /**
   * The planet core service.
   *
   * @var \Drupal\planet_payment_methods\Service\PlanetPaymentMethodsService
   */
  protected $paymentMethodsService;

  /**
   * The payment methods dedicated service.
   *
   * @var \Drupal\planet_payment_methods\Service\PlanetPaymentMethodsService
   */
  public function __construct(PlanetPaymentMethodsService $payment_methods_service) {
    $this->paymentMethodsService = $payment_methods_service;
  }

  /**
   * {@inheritdoc}
   */
  public static function create(ContainerInterface $container) {
    return new static(
      $container->get('planet_payment_methods.service')
    );
  }

  /**
   * Load payment methods.
   *
   * @param string $payment_method
   *   The selected payment method option.
   * @param string $channel
   *   The selected channel option.
   * @param int $how_many_already_loaded
   *   TThe number of already loaded payment methods.
   * @param int $limit
   *   The limit of payment methods to load.
   * @return \Symfony\Component\HttpFoundation\JsonResponse
   *   The JSON response.
   */
  public function loadPaymentMethods(string $payment_method, string $channel, int $how_many_already_loaded = 0, int $limit = 20) {
    $payment_methods = $this->paymentMethodsService->getPaymentMethods($payment_method, $channel, $how_many_already_loaded, $limit);

    if (!empty($payment_methods)) {
      $payment_methods['total_payment_methods_count'] = $this->paymentMethodsService->getTotalPaymentMethodsCount($this->paymentMethodsService->processPaymentMethodString($payment_method), $channel);
    }

    return new JsonResponse($payment_methods);
  }

  public function getTotalPaymentMethodsCount($payment_method, $channel) {
    $total_payment_methods_count = $this->paymentMethodsService->getTotalPaymentMethodsCount($payment_method, $channel);

    return new JsonResponse($total_payment_methods_count);
  }

}
