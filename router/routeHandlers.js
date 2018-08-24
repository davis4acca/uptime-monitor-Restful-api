// Define the route handlers
var routeHandlers = {};

routeHandlers.ping = function(data, callback) {
	callback(200);
};

routeHandlers.notFound = function(data, callback) {
	callback(404);
};

module.exports = routeHandlers;
