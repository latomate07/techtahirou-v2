#!/bin/sh

if [ "$ENABLE_SSL" = "true" ]; then
  cp /etc/nginx/nginx.conf.ssl.template /etc/nginx/nginx.conf
else
  cp /etc/nginx/nginx.conf.template /etc/nginx/nginx.conf
fi

envsubst '$DOMAIN_FRONT $DOMAIN_BACKOFFICE $DOMAIN_PHPMYADMIN' < /etc/nginx/nginx.conf > /etc/nginx/nginx.conf.final
mv /etc/nginx/nginx.conf.final /etc/nginx/nginx.conf

exec nginx -g 'daemon off;'