main = function main(to, message) {
	sandbox.run(message.match(/<\?js(.*?)\?>/)[1].trim(), function(output) {
		if (output.console.length > 0) {
			var isTrunc = false;

			if (output.console.length > 5) {
				isTrunc = true;
			}

			output.console.splice(0, 5).forEach(function(text) {
				if (typeof text === 'string') {
					// ignore...
				} else if (typeof text === 'object') {
					try {
						text = JSON.stringify(text);
					} catch (e) {
						text = text.toString();
					}
				} else {
					text = text.toString();
				}

				client.say(to, "'" + text.substring(0, 254) + "'");
			});

			if (isTrunc) {
				client.say(to, '[truncated]');
			}

			if (output.result.toString() !== 'null') {
				client.say(to, output.result.substring(0, 254));
			}
		} else {
			client.say(to, output.result.substring(0, 254));
		}
	});
};

delete require.cache[];
