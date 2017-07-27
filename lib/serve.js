// Packages
const detect = require('detect-port')
const serve = require('micro/lib')
const getModule = require('micro/lib/handler')

// Utilities
const listening = require('./listening')

module.exports = async (file, flags, module = getModule(file)) => {
  const server = serve(module)

  let port = flags.port || 3000 // Default to port 3000
  let host = flags.host

  const open = await detect(port)
  let inUse = open !== port

  if (inUse) {
    port = open

    inUse = {
      old: flags.port,
      open
    }
  }

  if (inUse && flags.port) {
    let messagePort = ` (${flags.port})`

    // Avoid rendering (true) when providing `-p`
    if (flags.port === true) {
      messagePort = ''
    }

    console.error(
      `micro: The port you provided${messagePort} is already in use.`
    )
    // eslint-disable-next-line unicorn/no-process-exit
    process.exit(1)
  }

  if (host === '0.0.0.0') {
    host = null
  }

  server.listen(port, host, err => {
    if (err) {
      console.error('micro:', err.stack)
      process.exit(1)
    }

    return listening(server, inUse, flags.silent)
  })
}
