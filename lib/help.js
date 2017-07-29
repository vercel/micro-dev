// Packages
const { green } = require('chalk')

module.exports = () => {
  const usage = `\n  Usage: ${green('micro-dev')} [path] [options]

  Options:

    ${green('-p, --port <n>')}  Port to listen on (defaults to 3000)
    ${green('-H, --host')}      The host on which micro will run
    ${green('-v, --version')}   Output the version number
    ${green('-h, --help')}      Show this usage information
  `

  return usage
}
