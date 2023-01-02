#!/usr/bin/env node

// Native
const {existsSync} = require('fs');
const path = require('path');

// Packages
const mri = require('mri');
const dotEnv = require('dotenv');

// Utilities
const generateHelp = require('../lib/help');
const serve = require('../lib/serve');
const {version} = require('../package');
const logError = require('../lib/error');

const flags = mri(process.argv.slice(2), {
	'default': {
		host: '::',
		port: 3000,
		limit: '1mb',
		dotenv: '.env'
	},
	'alias': {
		p: 'port',
		H: 'host',
		c: 'cold',
		w: 'watch',
		L: 'poll',
		s: 'silent',
		h: 'help',
		v: 'version',
		i: 'ignore',
		l: 'limit',
		d: 'dotenv'
	},
	unknown(flag) {
		console.log(`The option "${flag}" is unknown. Use one of these:`);
		console.log(generateHelp());
		process.exit(1);
	}
});

// When `-h` or `--help` are used, print out
// the usage information
if (flags.help) {
	console.log(generateHelp());
	process.exit();
}

// Print out the package's version when
// `--version` or `-v` are used
if (flags.version) {
	console.log(version);
	process.exit();
}

// Load the `.env` file
dotEnv.config({
	path: path.resolve(process.cwd(), flags.dotenv)
});

if (flags.cold && (flags.watch || flags.poll)) {
	logError(
		'The --cold flag is not compatible with --watch or --poll!',
		'watch-flags'
	);
	process.exit(1);
}

let file = flags._[0];

if (!file) {
	try {
		const packageJson = require(path.resolve(process.cwd(), 'package.json'));
		file = packageJson.main || 'index.js';
	} catch (err) {
		if (err.code !== 'MODULE_NOT_FOUND') {
			logError(
				`Could not read \`package.json\`: ${err.message}`,
				'invalid-package-json'
			);
			process.exit(1);
		}
	}
}

if (!file) {
	logError('No path defined!', 'path-missing');
	process.exit(1);
}

if (file[0] !== '/') {
	file = path.resolve(process.cwd(), file);
}

if (!existsSync(file)) {
	logError(
		`The file or directory "${path.basename(file)}" doesn't exist!`,
		'path-not-existent'
	);
	process.exit(1);
}

serve(file, flags);
