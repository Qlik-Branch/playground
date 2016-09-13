/*
 * Build this file to output a new browserify bundle that can be used in the browser.
 */
var fs = require('fs');
var browserify = require('browserify');

var b = browserify('./src/js/temp/playground-js-api.js', {
	standalone: 'playground'
});

b.bundle().pipe(fs.createWriteStream(__dirname + '/dist/playground-js-api.js'));
