var IRClient = require('irc').Client;
var Sandbox = require('Sandbox');
sandbox = new Sandbox();

clientConfig = {
	server: '',
	userName: '',
	realName: '',
	password: '',
	adminName: '',
	//////////////////////////////////////////////////
	configPrefix: '$js ',
	reloadMessage: 'reload',
	helpMessage: 'help',
	//////////////////////////////////////////////////
	port: 6667,
	debug: false,
	showErrors: false,
	autoRejoin: false,
	autoConnect: false,
	channels: [''],
	secure: false,
	selfSigned: false,
	certExpired: false,
	floodProtection: false,
	floodProtectionDelay: 1000,
	sasl: false,
	stripColors: false,
	channelPrefixes: "&#",
	messageSplit: 512
};

client = new IRClient(clientConfig.server, clientConfig.userName, clientConfig);

client.addListener('message', function(nick, to, text) {
	if (text === clientConfig.configPrefix + clientConfig.helpMessage) {
		client.say(to, 'Usage: <?js JavaScript_Code ?>');
	} else if (text === clientConfig.configPrefix + clientConfig.reloadMessage) {
		if (nick === clientConfig.adminName) {
			require('./main');
			client.say(to, 'Done.');
		} else {
			client.say(to, 'Unauthorized.');
		}
	} else if (/<\?js(.*?)\?>/.test(text)) {
		main(to, text);
	}
});

log.debug('Connecting...');
client.connect(0, function() {
	log.debug('Connected to "%s".', clientConfig.server);

	clientConfig.channels.forEach(function(chan) {
		client.join(chan, function() {
			log.debug('Connected to "%s".', chan);
		});
	});
});

module.exports = null;
