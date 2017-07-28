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

module.exports = async (server, inUse, file, flags, restarting) => {
  const details = server.address()
  const ipAddress = ip.address()
  const url = `http://${ipAddress}:${details.port}`
  const { isTTY } = process.stdout

  // Ensure that the server gets restarted if a file changes
  const watcher = watch(file).on('change', filePath => {
    const location = path.relative(process.cwd(), filePath)
    console.log(
      `${chalk.blue('File changed:')} ${location} - Restarting server...`
    )

    // Restart the server
    process.emit('SIGINT', true)
  })

  process.once('SIGINT', noExit => {
    watcher.close()

    server.close(() => {
      if (!noExit) {
        process.exit()
      }

      const toDelete = ['./serve', file]

      // Remove important modules from cache
      for (const item of toDelete) {
        const location = require.resolve(item)
        delete require.cache[location]
      }

      const serve = require('./serve')
      serve(file, flags, true)
    })
  })

  if (restarting) {
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
