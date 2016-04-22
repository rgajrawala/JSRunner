/**
 * Example config file.
 * @see http://node-irc.readthedocs.org/en/latest/API.html for more info.
 */

var config = {
	server: '', /**< Server address. */
	userName: '', /**< Display name. */
	realName: '', /**< Real name. */
	password: undefined, /**< Password. (Plaintext String) */
	port: 6667, /**< Server port. */
	debug: false, /**< Log certain events to stdout. */
	showErrors: false, /**< Log IRC errors. */
	autoRejoin: false, /**< Auto rejoin channels on kick. */
	autoConnect: false, /**< Auto connect on disconnect. */
	channels: [], /**< Channels. (Array of Strings) */
	secure: false, /**< SSL. See Node-IRC docs. */
	selfSigned: false, /**< Allow self-signed certificate. */
	certExpired: false, /**< Allow expired certificate. */
	floodProtection: false, /**< Queues messages. */
	floodProtectionDelay: 1000, /**< Delay between messages sent when flooded. */
	sasl: false, /**< SASL or die. */
	stripColors: false, /**< Removes colors from received messages. */
	channelPrefixes: "#&", /**< Channel prefixes to join. */
	messageSplit: 512 /** Split message if over certain length. */
};

module.exports = config;
