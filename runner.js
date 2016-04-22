var inspect = require('util').inspect; /**< Pretty `.toString`. */

var ts = require('typescript'); /**< Typescript compiler. */
var cs = require('coffee-script'); /**< Coffeescript compiler. */

var Sandbox = require('sandbox'); /**< Sandbox class. */
var IRClient = require('irc').Client; /**< IRC client class. */

var clientConfig = require('./config'); /**< Client config. */

var sandbox = new Sandbox(); /**< Sandbox to run code in. */
var client = new IRClient(clientConfig.server, clientConfig.userName, clientConfig); /**< IRC connection. */

client.addListener('message', function(nick, to, text) {
	/* Match `js>`, `ts>`, or `cs>` only */

	var match = text.match(/^(j|t|c)s>(.*)$/);

	if (!match) {
		return;
	}

	/* Compile code if code is TypeScript or CoffeeScript. */

	try {
		switch (match[1]) {
			case 't': match[2] = ts.transpile(match[2]); break;
			case 'c': match[2] = cs.compile(match[2]); break;
		}
	} catch (e) {
		client.say(to, '=> CompileError: ' + e.message);
		return;
	}

	/* Run code. */

	sandbox.run(match[2], function(output) {
		if (output.console.length > 0) {
			var isTrunc = false;

			/**< If more than N lines of output, take the first N lines. */

			if (output.console.length > 3) {
				isTrunc = true;
			}

			output.console.slice(0, 3).forEach(function(output) {
				/* Stringify output. */

				if (typeof output === 'object' || typeof output === 'function') {
					try {
						output = inspect(output);
					} catch (e) {}
				}

				/* Remove multiple space spam. */

				output = output.toString().replace(/\s+/g, ' ');

				/* Truncate line to N characters. */

				var truncText = output.length > 256 ? ' ...' : '';
				client.say(to, 'console: ' + output.substring(0, 256) + truncText);
			});

			/* If lines were truncated, say they were. */

			if (isTrunc) {
				client.say(to, 'console: [' + (output.console.length - 3) + ' line(s) truncated]');
			}
		}

		var result = output.result.replace(/\s+/g, ' ');
		var truncText = result.length > 256 ? ' ...' : '';
		client.say(to, '=> ' + result.substring(0, 256) + truncText);
	});
});

/* Connect client to IRC server. */

console.info('Connecting...');
client.connect(0, function() {
	console.info('Connected to "%s".', clientConfig.server);

	/* Join every channel. */

	clientConfig.channels.forEach(function(chan) {
		client.join(chan, function() {
			console.info('Connected to "%s".', chan);
		});
	});
});
