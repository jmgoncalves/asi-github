/** File: asi-github.js
 * asi-github
 *
 * Authors:
 *   - jmgoncalves
 */


/**
 *  REQUIRES
 */

var http = require('http');
var https = require('https');
var url = require('url');

/**
 *  CONSTANTS
 */

var PROCESS_NAME = 'asi-github';
var DEFAULT_PORT = 1337;
var USAGE_MESSAGE = 'Usage: http://node.jmgoncalv.es/<username> (e.g. http://node.jmgoncalv.es/jmgoncalves)';

/**
 *  HTTP HELPER FUNCTIONS
 *
 *  Functions for help querying the GitHub API
 */

/** Function: buildRequestOptions
 *  Builds the http.request options object for the target URL, taking in account proxy settings
 *
 *  Parameters:
 *   (String) targetUrl - target URL, enconding the endpoint of the HTTPS request
 *  Returns:
 *   (Object) options object for sending an HTTPS request to the target URL
 */
var buildRequestOptions = function(targetUrl) {
	timestampsDate = new Date();
	console.log('['+timestampsDate.toISOString()+'] Building HTTPS request for '+targetUrl);

	var parsedUrl = url.parse(targetUrl);

	var request = {
		headers: {'User-Agent': PROCESS_NAME},
		method: 'GET',
		hostname: parsedUrl.hostname,
		port: 443,
		path: parsedUrl.path
	}

	return request;
};

/** Function: getFromSource
 *  Requests an endpoint via HTTPS and calls the callback function with the response data as parameter
 *
 *  Parameters:
 *   (Object) requestOptions - options object, describing the endpoint of the HTTPS request
 *   (Function) callback - function to handle the HTTPS response data
 */
var getFromSource = function(requestOptions, callback) {
	var req = https.request(requestOptions, function(res) {
	  res.setEncoding('utf8');
	  var responseData = '';

		res.on('data', function (chunk) {
	    responseData = responseData + chunk;
	  });

	  res.on('end', function () {
	    callback(responseData);
	  });
	});

	req.on('error', function(e) {
	  console.log('Problem with request: ' + e.message);
	});

  req.end();
};

/**
 *  LOGIC
 *
 *  App Logic
 */

 /** Function: top5
  *	 Sorts the repositories by size and returns the top5
  *
  *  Parameters:
  *   (http.IncomingMessage) req - Incomming request to be handled
  *   (http.ServerResponse) res - Response to be returned
  */
var top5 = function(reposJson) {
	reposJson.sort(function(a,b){
	  return b.size-a.size;
	});
	return reposJson.slice(0,5);
}

/**
 *  MAIN
 *
 *  Main part of the application, where the main HTTP server function and the application intialization are defined
 */

/** Function: main
 *  Handles incomming requests, calls the logic function and responds
 *
 *  Parameters:
 *   (http.IncomingMessage) req - Incomming request to be handled
 *   (http.ServerResponse) res - Response to be returned
 */
var main = function (req, res) {
	timestampsDate = new Date();
	console.log('['+timestampsDate.toISOString()+'] Received '+req.url+' request from '+req.connection.remoteAddress);

	var githubUsername = url.parse(req.url).pathname.slice(1,req.url.length);

	if (githubUsername.length>0) {
		var requestOptions = buildRequestOptions('https://api.github.com/users/'+githubUsername+'/repos');
		getFromSource(requestOptions, function(responseData) {
			var repos = JSON.parse(responseData);
			res.writeHead(200, {'Content-Type': 'application/json'});

			if (repos.constructor === Array) {
				// got array from GitHub - handle normal case
				res.end(JSON.stringify(top5(repos)));
			} else {
				// forward the object GitHub returned
				res.end(JSON.stringify(repos));
			}
		});
	} else {
		res.writeHead(200);
		res.end(USAGE_MESSAGE);
	}
};

/** Application Init
 *
 *  Renames process
 *  Aquires HTTP Proxy from env, if configured
 *  Aquires port setting from arguments
 *  Starts listening for HTTP requests
 *  Outputs configuration
 */

process.title = PROCESS_NAME;

var timestampsDate = new Date();

var port = DEFAULT_PORT;
if (process.argv.length>2) {
	port = parseInt(process.argv[2],10);
	if (isNaN(port)) {
		port = DEFAULT_PORT;
		console.log('['+timestampsDate.toISOString()+'] Bad port supplied: "'+process.argv[2]+'" - using default...');
	}
}

http.createServer(main).listen(port);
console.log('['+timestampsDate.toISOString()+'] Server running at port '+port+'...');
