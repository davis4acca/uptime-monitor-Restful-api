/* 
* Primary file for API



*/

// Dependencies
var http = require('http');
var url = require('url');

// The server should respond to all requests with a string
var server = http.createServer(function(req, res) {
	// Get the url and parse it
	var parsedUrl = url.parse(req.url, true);

	// Get the path
	var path = parsedUrl.pathname; // untrimmed path
	var trimmedPath = path.replace(/^\/+|\/+$/g, '');

	// Get the query string as an object
	var queryStringObject = parsedUrl.query;

	// Get the HTTP Method
	var method = req.method.toLowerCase();

	// Send the response

	// Log what path the person was asking for
	res.end('Hello world\n');
	console.log(
		`Request is recieved on path: '${trimmedPath}' with this method: '${method.toUpperCase()}' and with these query string parameters: ${queryStringObject}`
	);
});
// Start the server, and have it listen on port 3000
server.listen(3000, function() {
	console.log('The server is listening on port 3000 now');
});
