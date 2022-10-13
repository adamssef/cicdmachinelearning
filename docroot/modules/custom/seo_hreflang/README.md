CONTENTS OF THIS FILE
---------------------

 * Introduction
 * Requirements
 * Installation
 * Configuration
 * Functionality
 * Troubleshooting
 * Extend
 * Maintainers

INTRODUCTION
------------


The SEO hreflang module specify the proper hreflang code using the custom language format (e.g., es-es, es-mx).

Add hreflang attribute for SEO purpose in single language site and multilingual as well.


REQUIREMENTS
------------

* No contributed module require.

INSTALLATION
------------

* Install as you would normally install a contributed Drupal module. Visit
   https://www.drupal.org/node/1897420 for further information.


CONFIGURATION
-------------

* Configutaion URLs **/admin/config/regional/seo-hreflang**.

FUNCTIONALITY
-------------

* Add hreflang attribute with custom hreflang code for seo.

TROUBLESHOOTING
---------------

 * If the hreflang does not override in page view source, check the following:

   - Check seo_hreflang_page_attachments_alter hook in seo_hreflang.module file.

EXTEND
------

 * seo_hreflang_page_attachments_alter for override default hreflang.