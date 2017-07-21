const {green} = require('chalk')

module.exports = unknown => {
  let usage = ''

  if (unknown) {
    usage += `The option "${unknown}" is unknown. Use one of these:`
    usage += '\n\n'
  }

  usage += `\n  Usage: ${green('micro-dev')} [options] [command]

  Options:

    ${green('-p, --port <n>')}  Port to listen on (defaults to 3000)
    ${green('-v, --version')}   Output the version number
  `

  console.log(usage)
  process.exit()
}
