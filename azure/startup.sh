#!/bin/bash

cp /home/site/wwwroot/azure/default /etc/nginx/sites-enabled/default
cp /home/site/wwwroot/azure/extensions.ini /usr/local/etc/php/conf.d/
cp /home/site/wwwroot/azure/nginx.conf /etc/nginx/

service nginx reload