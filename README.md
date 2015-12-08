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

ProxyPass /docs/VVEVM http://test.mvn.huygens.knaw.nl/docs/VVEVM
ProxyPassReverse /docs/VVEVM http://test.mvn.huygens.knaw.nl/docs/VVEVM


```

Jenkins
---
Version control wordt uitgelezen door jenkins project met herkenbare naam