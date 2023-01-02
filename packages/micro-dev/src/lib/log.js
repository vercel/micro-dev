// Packages
const chalk = require('chalk');
const jsome = require('jsome');
const PrettyError = require('pretty-error');
const stringLength = require('string-length');
const {json, send} = require('micro');

const pe = new PrettyError();

jsome.colors = {
	'num': 'cyan',
	'str': 'green',
	'bool': 'red',
	'regex': 'blue',
	'undef': 'grey',
	'null': 'grey',
	'attr': 'reset',
	'quot': 'reset',
	'punc': 'reset',
	'brack': 'reset'
};

const logLine = (message, date) => {
	const dateString = `${chalk.grey(date.toLocaleTimeString())}`;
	let logSpace =
    process.stdout.columns - stringLength(message) - stringLength(dateString);

	if (logSpace <= 0) {
		logSpace = 10;
	}

	console.log(`${message}${' '.repeat(logSpace)}${dateString}\n`);
};

const logRequest = async ({req, start, requestIndex, limit}) => {
	logLine(`> #${requestIndex} ${chalk.bold(req.method)} ${req.url}`, start);

	if (req.headers['content-length'] > 0 && req.headers['content-type'].indexOf('application/json') === 0) {
		try {
			const parsedJson = await json(req, {limit});
			jsome(parsedJson);
			console.log('');
		} catch (err) {
			console.log(`JSON body could not be parsed: ${err.message} \n`);
		}
	}
};

const logStatusCode = statusCode => {
	if (statusCode >= 500) {
		return chalk.red(statusCode);
	}

	if (statusCode >= 400 && statusCode < 500) {
		return chalk.yellow(statusCode);
	}

	if (statusCode >= 300 && statusCode < 400) {
		return chalk.blue(statusCode);
	}

	if (statusCode >= 200 && statusCode < 300) {
		return chalk.green(statusCode);
	}

	return statusCode;
};

const logResponse = async ({res, end, endTime, requestIndex, chunk}) => {
	const statusCode = logStatusCode(res.statusCode);

	logLine(`< #${requestIndex} ${statusCode} [+${end}]`, endTime);

	if (res.microErr) {
		console.log(pe.render(res.microErr));
		return;
	}

	try {
		const str = JSON.parse(chunk);
		jsome(str);
	} catch (err) {
		if (typeof chunk === 'string') {
			console.log(`${chunk.substr(0, 100)}${chunk.length > 100 ? '...' : ''}`);
		}
	}
};

let requestCounter = 0;

const initLog = (req, res, limit) => {
	const start = new Date();
	const requestIndex = ++requestCounter;

	console.log(chalk.grey(`\n${'—'.repeat(process.stdout.columns)}\n`));

	const reqBodyReady = logRequest({req, start, requestIndex, limit});

	const end = res.end;

	res.end = (chunk, encoding, callback) => {
		res.end = end;
		const endTime = new Date();
		const delta = endTime - start;
		const requestTime =
      delta < 10000 ? `${delta}ms` : `${Math.round(delta / 1000)}s`;

		reqBodyReady.then(() =>
			logResponse({
				res,
				start,
				end: requestTime,
				endTime,
				requestIndex,
				chunk
			}));

		return res.end(chunk, encoding, callback);
	};
};

module.exports = (fn, limit) => async (req, res) => {
	initLog(req, res, limit);

	try {
		return await fn(req, res);
	} catch (err) {
		res.microErr = err;

		const {statusCode = 500, stack} = err;
		return send(res, statusCode, stack);
	}
};
