/* 
* Primary file for API
*/

// Node core Dependencies
var http = require('http');
var https = require('https');
var url = require('url');
var StringDecoder = require('string_decoder').StringDecoder;
var config = require('./config');
var fs = require('fs');

// My own dependencies
var routeHandlers = require('./router/routeHandlers');
var router = require('./router/router')(routeHandlers);

// Instantiate the HTTP server
var httpServer = http.createServer(function(req, res) {
	// Get the url and parse it
	unifiedServer(req, res);
});

// Start the HTTP server
httpServer.listen(config.httpPort, function() {
	console.log(`The HTTP server is listening on port ${config.httpPort} now`);
});

// Instantiate the HTTPS server
var httpsServerOptions = {
	key: fs.readFileSync('./https/key.pen'),
	cert: fs.readFileSync('./https/cert.pem')
};

var httpsServer = https.createServer(httpsServerOptions, function(req, res) {
	// Get the url and parse it
	unifiedServer(req, res);
});

// Start the HTTPS server
httpsServer.listen(config.httpsPort, function() {
	console.log(`The HTTPS server is listening on port ${config.httpsPort} now`);
});

// All the server logic for both the http and https server

function unifiedServer(req, res) {
	var parsedUrl = url.parse(req.url, true);

	// Get the path
	var path = parsedUrl.pathname; // untrimmed path
	var trimmedPath = path.replace(/^\/+|\/+$/g, '');

	// Get the query string as an object
	var queryStringObject = parsedUrl.query;
	console.log(queryStringObject);
	// Get the HTTP Method
	var method = req.method.toLowerCase();

	// Get the headers as an object
	var headers = req.headers;

	// Get the payload, if any
	var decoder = new StringDecoder('utf-8');
	var buffer = '';
	// data comes coded in utf-8
	// we decode it with decoder and append to our buffer string
	req.on('data', function(data) {
		buffer += decoder.write(data);
	});
	// when stream has been finished
	req.on('end', function() {
		buffer += decoder.end();

		// Choose the route handler to handle a specific route if not found use notfoud handler...
		var chosenHandler = typeof router[trimmedPath] !== 'undefined' ? router[trimmedPath] : routeHandlers.notFound;

		// Construct the data object to send to the router handler
		var data = {
			trimmedPath,
			queryStringObject,
			method,
			headers,
			payload: buffer
		};

		// Route the request to the handler specified in the router
		chosenHandler(data, function(statusCode, payload) {
			//  Use the status code callback by the handler or default to 200
			statusCode = typeof statusCode == 'number' ? statusCode : 200;
			// use the payload callback by the handler, or default to empty object
			payload = typeof payload == 'object' ? payload : {};

			// Conver the payload to a string
			var payloadString = JSON.stringify(payload);

			//  Return the response
			res.setHeader('Content-Type', 'application/json');
			res.writeHead(statusCode);
			res.end(payloadString);
			// Log request path
			console.log('Request recieved with this payload : ', statusCode, payloadString);
		});
	});
}
