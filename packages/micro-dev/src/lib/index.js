// Ensure that the loaded files and packages have the correct env
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

// Packages
const serve = require('micro/lib');
const ip = require('ip');
const chalk = require('chalk');
const boxen = require('boxen');

// Utilities
const log = require('./log');


/**
 * micro-dev for programmatic usage
 *
 * Usage:
 *
 * require('micro-dev')({ silent: false, limit: '1mb', host: '::', port: PORT })(handler)
 */
module.exports = flags => handler => {
	const module = flags.silent ? handler : log(handler, flags.limit);
	const server = serve(module);

	const sockets = [];
	server.on('connection', socket => {
		const index = sockets.push(socket);
		socket.once('close', () => sockets.splice(index, 1));
	});

	server.listen(flags.port, flags.host, err => {
		if (err) {
			console.error('micro:', err.stack);
			process.exit(1);
		}

		// message
		const details = server.address();
		const ipAddress = ip.address();
		const url = `http://${ipAddress}:${details.port}`;
		let message = chalk.green('Micro is running programmatically!');
		message += '\n\n';

		const host = flags.host === '::' ? 'localhost' : flags.host;
		const localURL = `http://${host}:${details.port}`;

		message += `• ${chalk.bold('Local:           ')} ${localURL}\n`;
		message += `• ${chalk.bold('On Your Network: ')} ${url}\n\n`;

		const box = boxen(message, {
			padding: 1,
			borderColor: 'green',
			margin: 1
		});

		// Print out the message
		console.log(box);
	});
};
