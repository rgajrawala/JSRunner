/*!
 * log.js
 * https://www.npmjs.org/package/log
 *
 * Copyright(c) 2010 TJ Holowaychuk <tj@vision-media.ca>
 * MIT Licensed
 *
 * Edited by Usandfriends <https://github.com/usandfriends>.
 */

var path = require('path');
var fmt = require('util').format;
var colors = require('colors/safe');
var moment = require('moment');
var EventEmitter = require('events').EventEmitter;

var Log = exports = module.exports = function Log(level, stream) {
	(typeof level === 'string') && (level = exports[level.toUpperCase()]);

	this.level = level || exports.DEBUG;
	this.stream = stream || process.stdout;
}

{
	var iterator = 0;

	exports.FATAL = iterator++;
	exports.ERROR = iterator++;
	exports.WARN  = iterator++;
	exports.DEBUG = iterator++;
	exports.INFO  = iterator++;
}

Log.prototype = {
	log: function log(levelStr, /*file, line,*/ color, args) {
		if (exports[levelStr] <= this.level) {
			this.stream.write(color(
				//'(' + path.basename(file) + ':' + line + ') ' +
				'[' + moment().format('L HH:mm:ss') + '] ' +
				// levelStr + ' ' +
				fmt.apply(null, args/*Array.prototype.slice.call(args, 2, Infinity)*/) + '\n'
			));
		}
	},
	fatal: function fatal(/*file, line,*/ msg) {
		this.log('FATAL', /*file, line,*/ colors.red.bold, arguments);
	},
	error: function error(/*file, line,*/ msg) {
		this.log('ERROR', /*file, line,*/ colors.red, arguments);
	},
	warn: function warning(/*file, line,*/ msg) {
		this.log('WARN', /*file, line,*/ colors.yellow, arguments);
	},
	debug: function debug(/*file, line,*/ msg) {
		this.log('DEBUG', /*file, line,*/ colors.grey, arguments);
	},
	info: function info(/*file, line,*/ msg) {
		this.log('INFO', /*file, line,*/ colors.white, arguments);
	}
};

Log.prototype.__proto__ = EventEmitter.prototype;

log = new Log('info');
