// Packages
const getPort = require('get-port')
const serve = require('micro/lib')
const getModule = require('micro/lib/handler')

// Utilities
const listening = require('./listening')
const log = require('./log')

module.exports = async (file, flags, restarting) => {
  // Ensure that the loaded files have the correct env
  process.env.NODE_ENV = 'development'

  // And then load the files
  const module = log(getModule(file))
  const server = serve(module)

  // `3000` is the default port
  let port = parseInt(flags.port, 10) || 3000

  // Check if the specified port is already in use (if none
  // is specified, the default one will be checked)
  const open = await getPort(port)
  const old = port

  // Define if the port is already in use
  let inUse = open !== port

  if (inUse) {
    port = open
    inUse = { old, open }
  }

  const sockets = []

  server.listen(port, flags.host, err => {
    if (err) {
      console.error('micro:', err.stack)
      process.exit(1)
    }

    if (restarting) {
      flags.restarted = true
    }

    flags._[0] = file
    return listening(server, inUse, flags, sockets)
  })

  server.on('connection', socket => {
    const index = sockets.push(socket)
    socket.once('close', () => sockets.splice(index, 1))
  })
}
