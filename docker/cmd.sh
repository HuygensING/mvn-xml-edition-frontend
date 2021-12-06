nginx -t -c /nginx_conf/nginx.conf && \
nginx -c /nginx_conf/nginx.conf -g 'daemon off;'