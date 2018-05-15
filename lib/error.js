// Packages
const {red, blue} = require('chalk');

module.exports = (message, errorCode) => {
	const repo = errorCode === 'watch-flags' ? 'micro-dev' : 'micro';

	console.error(`${red('Error:')} ${message}`);
	console.error(`${blue('How to Fix It:')} https://err.sh/${repo}/${errorCode}`);
};
