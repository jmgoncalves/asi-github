Example API implementation for ASI using Node. Exposes an HTTP API that returns the five largest repositories of a used, by doing a subsequent call to the GitHub API.

Usage: http://node.jmgoncalv.es/&lt;username&gt; (e.g. http://node.jmgoncalv.es/jmgoncalves)

Deployment
----------

For the deployment I used my personal server. There is an Apache receiving the requests, and forwarding them to the Node application.

An init script is present, as well as a logrotate and monit configuration.

Structure
---------

The source is in the *src* dir, and is self-explanatory with comments. A main method that handles incoming requests and responses uses helper methods to do the GitHub API call and to process the data.

The *conf* dir has configuration files have to do with the deployment. You will find them under the following sub-dirs:

* apache - Apache2 configuration file to be placed @ /etc/apache2/sites-available/ (needs to be enabled after)
* init - init script to be placed @ /etc/init/ (enables sudo start <app>)
* logrotate - logrotate config script to be placed @ /etc/logrotate.d/
* monit - monit config to be placed @ /etc/monit/conf.d
