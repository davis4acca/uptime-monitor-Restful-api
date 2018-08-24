// Create and export configuration variables

//  Containeer for all the enviroments

var enviroments = {};

// Staging (default) enviroment

enviroments.staging = {
	httpPort: 3000,
	httpsPort: 3001,
	envName: 'staging'
};

//  Production enviroment
enviroments.production = {
	httpPort: 5000,
	httpsPort: 5001,
	envName: 'production'
};

// Determine which enviroment was passed as a command-line argument

var currentEnviroment = typeof process.env.NODE_ENV == 'string' ? process.env.NODE_ENV.toLowerCase() : '';

// Check that the current enviroment is one of the enviroments aboe, if not' default to stagin

var enviromentToExport =
	typeof enviroments[currentEnviroment] == 'object' ? enviroments[currentEnviroment] : enviroments.staging;

module.exports = enviromentToExport;
