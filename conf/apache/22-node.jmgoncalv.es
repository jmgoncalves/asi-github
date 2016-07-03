<VirtualHost *:80>
  ServerName node.jmgoncalv.es

  ProxyRequests off

  ProxyPass / http://127.0.0.1:1337/
  ProxyPassReverse / http://127.0.0.1:1337/
</VirtualHost>
