// Native
const path = require('path')

// Packages
const { write: copy } = require('clipboardy')
const ip = require('ip')
const chalk = require('chalk')
const boxen = require('boxen')
const { watch } = require('chokidar')

const copyToClipboard = async text => {
  try {
    await copy(text)
    return true
  } catch (err) {
    return false
  }
}

module.exports = async (server, inUse, flags, sockets) => {
  const details = server.address()
  const ipAddress = ip.address()
  const url = `http://${ipAddress}:${details.port}`
  const { isTTY } = process.stdout
  const file = flags._[0]

  const watchConfig = {
    ignoreInitial: true
  }

  // Start watching the project files
  const watcher = watch(process.cwd(), watchConfig)

  // Ensure that the server gets restarted if a file changes
  watcher.on('all', (event, filePath) => {
    const location = path.relative(process.cwd(), filePath)
    console.log(
      `\n${chalk.blue('File changed:')} ${location} - Restarting server...`
    )

    // Restart the server
    process.emit('SIGINT', true)
  })

  process.once('SIGINT', noExit => {
    const watched = watcher.getWatched()
    watcher.close()

    if (flags.graceful) {
      console.log('\nGracefully closing server. Please wait...')
    } else {
      // Destroy all sockets before closing the server
      // Otherwise it will gracefully exit and take a long time
      for (const socket of sockets) {
        socket.destroy()
      }
    }

    server.close(() => {
      if (!noExit) {
        process.exit()
      }

      const toDelete = []

      for (const mainPath in watched) {
        if (!{}.hasOwnProperty.call(watched, mainPath)) {
          continue
        }

        const subPaths = watched[mainPath]

        for (const subPath of subPaths) {
          const full = path.join(mainPath, subPath)
          toDelete.push(full)
        }
      }

      // Remove file that changed from the `require` cache
      for (const item of toDelete) {
        const location = require.resolve(item)
        delete require.cache[location]
      }

      // Restart the server
      require('./serve')(file, flags, true)
    })
  })

  if (flags.restarting) {
    console.log(chalk.green('Restarted!'))
    return
  }

  let message = chalk.green('Micro is running!')

  if (inUse) {
    message +=
      ' ' +
      chalk.red(
        `(on port ${inUse.open}, because ${inUse.old} is already in use)`
      )
  }

  message += '\n\n'

  const localURL = `http://localhost:${details.port}`

  message += `• ${chalk.bold('Local:           ')} ${localURL}\n`
  message += `• ${chalk.bold('On Your Network: ')} ${url}\n\n`

  if (isTTY) {
    const copied = await copyToClipboard(localURL)

    if (copied) {
      message += `${chalk.grey('Copied local address to clipboard!')}`
    }
  }

  const box = boxen(message, {
    padding: 1,
    borderColor: 'green',
    margin: 1
  })

  // Print out the message
  console.log(box)
}
