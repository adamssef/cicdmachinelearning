PLANET SITE STUDIO CUSTOM ELEMENT
---------------------
This module allow to add js to the site studio components.

Installation
------------
 Install the module as you would normally install a Drupal
 module. Visit [www.drupal.org/node/1897420](https://www.drupal.org/node/1897420) for further information.
 Enable the module

Usage
------------
 * Create a new JS file in the /js/ folder.
 * Add the JS file to the planet_sitestudio_custom_elements.libraries.yml file.
 * Edit the component in site studio.
 * Add an "Element to Attach JS" component to the Layout Canvas area.
 * Configure the element:
 1. Your Hook Theme Element: attach_js_element
 2. Your Template name: attach-js-template
 3. Your Module name: planet_sitestudio_custom_elements
 4. Library Name: <your-js-library-name> e.g.: helperJs
