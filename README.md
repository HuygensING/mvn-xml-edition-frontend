Aandachtspunten mvn-xml-edition-frontend
===

Search omgeving
---
De search omgeving is nu nog hardcoded voor de vvevm editie

Vhost
---
Draai voor ontwikkelen een lokale apache met in conf/sites-enabled een soortgelijke vhost inrichting:

``` apacheconf
LoadModule proxy_http_module /usr/lib/apache2/modules/mod_proxy_http.so

<VirtualHost *:80>
    ServerName mvn.local
    ProxyPass /docs http://[TESTOMGEVING MVN]/docs
    ProxyPassReverse /docs http://[TESTOMGEVING MVN]/docs

    DocumentRoot "/path/to/mvn-xml-edition-frontend"
 <Directory "/path/to/mvn-xml-edition-frontend">
        DirectoryIndex index.html
        AllowOverride All
        Require all granted
</Directory>

</VirtualHost>
```

Jenkins
---
Version control wordt uitgelezen door jenkins project met herkenbare naam