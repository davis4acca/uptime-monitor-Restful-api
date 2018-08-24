// Library for storing and editing data

// Dependencies
var fs = require('fs');
var path = require('path');

// Container for the module (to be exported)
var lib = {};

// Base directory of the data folder
lib.baseDir = path.join(__dirname, '/../.data/');

// Write data to a file
lib.create = function(dir, file, data, callback) {
	// Open the file for writing
	fs.open(lib.baseDir + dir + '/' + file + '.json', 'wx', function(err, fileDescriptor) {
		if (!err && fileDescriptor) {
			// Convert data to string
			var stringData = JSON.stringify(data);

			// Write to file and close it
			fs.writeFile(fileDescriptor, stringData, function(err) {
				if (!err) {
					fs.close(fileDescriptor, function(err) {
						if (!err) {
							callback(false);
						} else {
							callback('Error closing new file');
						}
					});
				} else {
					callback('Error writing to new file');
				}
			});
		} else {
			callback('Could not create new file, it may already exist');
		}
	});
};

// Read data from a file
lib.read = function readFile(dir, file, callback) {
	fs.readFile(lib.baseDir + dir + '/' + file + '.json', 'utf8', function readFileCallback(err, data) {
		callback(err, data);
	});
};

// Update data inside a file
lib.update = function updateFile(dir, file, data, callback) {
	// Open the file for writing
	var fileName = lib.baseDir + dir + '/' + file + '.json';
	fs.open(fileName, 'r+', function(err, fileDescriptor) {
		if (!err && fileDescriptor) {
			//  Convert data to string
			var stringData = JSON.stringify(data);

			//  truncate the file

			fs.truncate(fileDescriptor, function(err) {
				if (!err) {
					//  Write to file and close it
					fs.writeFile(fileDescriptor, stringData, function writeFileCB(err) {
						if (!err) {
							fs.close(fileDescriptor, function(err) {
								if (!err) {
									callback(false);
								} else {
									callback('Error closing the file');
								}
							});
						} else {
							callback('Error writing to existing file');
						}
					});
				} else {
					calblack('Error truncating failed');
				}
			});
		} else {
			callback('Could not open the file for updating, it may not exist yet');
		}
	});
};

// Deliting a file
lib.delete = function(dir, file, callback) {
	// Unlink the file
	var fileName = lib.baseDir + dir + '/' + file + '.json';
	fs.unlink(fileName, function(err) {
		if (!err) {
			callback(false);
		} else {
			callback('Error deliting file!');
		}
	});
};
// Export the module
module.exports = lib;
