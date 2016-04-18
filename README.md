Aandachtspunten mvn-xml-edition-frontend
===

Apache modules
---
```
$ sudo a2enmod proxy
$ sudo a2enmod rewrite
$ sudo a2enmod headers
```

Vhost
---
Draai voor ontwikkelen een lokale apache met in conf/sites-enabled een soortgelijke vhost inrichting:

``` apacheconf
LoadModule proxy_http_module /usr/lib/apache2/modules/mod_proxy_http.so
<VirtualHost *:80>
    # This first-listed virtual host is also the default for *:80

    ServerName test.mvn.local
    ProxyPass /docs http://[MVN TEST DOMAIN]/docs
    ProxyPassReverse /docs http://[MVN TEST DOMAIN]/docs

    DocumentRoot "/path/to/mvn-xml-edition-frontend"
    <Directory "/path/to/mvn-xml-edition-frontend">
           DirectoryIndex index.html
           AllowOverride All
           Require all granted
    </Directory>
</VirtualHost>

```

Navigeer dan naar: http://test.mvn.local/BS/



Jenkins
---
Version control wordt uitgelezen door jenkins project met herkenbare naam