// Packages
const { green } = require('chalk')

module.exports = () => {
  const usage = `\n  Usage: ${green('micro-dev')} [options] [command]

  Options:

    ${green('-p, --port <n>')}  Port to listen on (defaults to 3000)
    ${green('-v, --version')}   Output the version number
    ${green('-h, --help')}      Show this usage information
  `

  return usage
}
