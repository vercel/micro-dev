// Packages
const { green: g } = require('chalk')

module.exports = () => {
  const usage = `\n  Usage: ${g('micro-dev')} [path] [options]

  Options:

    ${g('-p, --port <n>')}      Port to listen on (defaults to 3000)
    ${g('-H, --host')}          The host on which micro will run
    ${g('-c, --cold')}          Disable hot reloading
    ${g('-w, --watch <dir>')}   A directory to watch in addition to [path]
    ${g('-L, --poll')}          Poll for code changes rather than using events
    ${g('-i  --ignore <dir>')}  Ignore watching a file, directory, or glob
    ${g('-s, --silent')}        Disable requests log
    ${g('-v, --version')}       Output the version number
    ${g('-h, --help')}          Show this usage information
  `

  return usage
}
