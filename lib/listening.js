// Native
const path = require('path')

// Packages
const ignoredDirectories = require('ignore-by-default').directories()
const { write: copy } = require('clipboardy')
const getIgnoredFromGit = require('ignored')
const { watch } = require('chokidar')
const debounce = require('debounce')
const pkgUp = require('pkg-up')
const chalk = require('chalk')
const boxen = require('boxen')
const ip = require('ip')

const getIgnoredFiles = ({ flags, gitignore, pkg }) => {
  const set = new Set()
  const addIgnore = value => set.add(value)

  getIgnoredFromGit(gitignore).forEach(addIgnore)
  if (flags.ignore) flags.ignore.forEach(addIgnore)
  if (pkg.ignore) pkg.ignore.forEach(addIgnore)
  ignoredDirectories.forEach(addIgnore)

  return Array.from(set)
}

const copyToClipboard = async text => {
  try {
    await copy(text)
    return true
  } catch (err) {
    return false
  }
}

const restartServer = (file, flags, watcher) => {
  const watched = watcher.getWatched()
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
    let location

    try {
      location = require.resolve(item)
    } catch (err) {
      continue
    }

    delete require.cache[location]
  }

  // Restart the server
  require('./serve')(file, flags, true)
}

const destroySockets = list => {
  // Destroy all sockets before closing the server
  // Otherwise it will gracefully exit and take a long time
  for (const socket of list) {
    socket.destroy()
  }
}

module.exports = async (server, inUse, flags, sockets) => {
  const details = server.address()
  const ipAddress = ip.address()
  const url = `http://${ipAddress}:${details.port}`
  const { isTTY } = process.stdout
  const file = flags._[0]

  if (!flags.cold) {
    let toWatch = flags.watch || false

    // Find out which directory to watch
    const closestPkg = await pkgUp(path.dirname(file))
    const gitignore = path.join(path.dirname(file, '.gitignore'))
    const ignored = getIgnoredFiles({flags, gitignore, pkg: closestPkg})

    const watchConfig = {
      usePolling: flags.poll,
      ignoreInitial: true,
      ignored
    }

    if (Array.isArray(toWatch)) {
      toWatch.push(file)
    } else if (toWatch) {
      toWatch = [toWatch, file]
    } else {
      toWatch = [closestPkg ? path.dirname(closestPkg) : process.cwd()]
    }

    // Start watching the project files
    const watcher = watch(toWatch, watchConfig)

    // Ensure that the server gets restarted if a file changes
    watcher.once(
      'all',
      debounce((event, filePath) => {
        const location = path.relative(process.cwd(), filePath)

        console.log(
          `\n${chalk.blue('File changed:')} ${location} - Restarting server...`
        )

        destroySockets(sockets)

        // Ensure the same port when restarting server
        flags.port = details.port

        // Restart server
        server.close(restartServer.bind(this, file, flags, watcher))
      }, 10)
    )
  }

  if (flags.restarted) {
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
