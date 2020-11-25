#!/bin/sh

envsubst < /usr/share/nginx/html/config/config.tmpl.js > /usr/share/nginx/html/config/config.js && nginx -g 'daemon off;' || cat /usr/share/nginx/html/config/config.js