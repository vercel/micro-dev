// Ensure that the loaded files and packages have the correct env
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

// Packages
const getPort = require('get-port');
const serve = require('micro/lib');
const getModule = require('micro/lib/handler');

// Utilities
const listening = require('./listening');
const log = require('./log');

module.exports = async (file, flags, restarting) => {
	if (restarting) {
		process.emit('SIGUSR2');
	}

	const handler = await getModule(file);

	// And then load the files
	const module = flags.silent ? handler : log(handler, flags.limit);
	const server = serve(module);

	const {isNaN} = Number;
	let port = Number(flags.port);

	if (isNaN(port) || (!isNaN(port) && (port < 1 || port >= 2 ** 16))) {
		console.error(`Port option must be a number. Supplied: ${flags.port}`);
		process.exit(1);
	}

	// Check if the specified port is already in use (if none
	// is specified, the default one will be checked)
	const open = await getPort(port);
	const old = port;

	// Define if the port is already in use
	let inUse = open !== port;

	// Only overwrite the port when restarting
	if (inUse && !restarting) {
		port = open;
		inUse = {old, open};
	}

	const sockets = [];

	server.listen(port, flags.host, err => {
		if (err) {
			console.error('micro:', err.stack);
			process.exit(1);
		}

		if (restarting) {
			flags.restarted = true;
		}

		flags._[0] = file;
		return listening(server, inUse, flags, sockets);
	});

	server.on('connection', socket => {
		const index = sockets.push(socket);
		socket.once('close', () => sockets.splice(index, 1));
	});
};
