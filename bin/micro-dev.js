#!/usr/bin/env node

// Native
const { existsSync } = require('fs')
const path = require('path')

// Packages
const mri = require('mri')

// Utilities
const generateHelp = require('../lib/help')
const { version } = require('../package')
const serve = require('../lib/serve')

const flags = mri(process.argv.slice(2), {
  string: ['host', 'port'],
  boolean: ['help', 'version'],
  alias: {
    p: 'port',
    H: 'host',
    h: 'help',
    v: 'version'
  },
  unknown(flag) {
    console.log(`The option "${flag}" is unknown. Use one of these:`)
    console.log(generateHelp())
    process.exit()
  }
})

// When `-h` or `--help` are used, print out
// the usage information
if (flags.help) {
  console.log(generateHelp())
  process.exit()
}

// Print out the package's version when
// `--version` or `-v` are used
if (flags.version) {
  console.log(version)
  process.exit()
}

let file = flags._[0]

if (!file) {
  try {
    // eslint-disable-next-line import/no-dynamic-require
    const packageJson = require(path.resolve(process.cwd(), 'package.json'))
    file = packageJson.main || 'index.js'
  } catch (err) {
    if (err.code !== 'MODULE_NOT_FOUND') {
      console.error(`Could not read \`package.json\`: ${err.message}`)
      process.exit(1)
    }
  }
}

if (!file) {
  console.error('Please supply a file!')
  process.exit(1)
}

if (file[0] !== '/') {
  file = path.resolve(process.cwd(), file)
}

if (!existsSync(file)) {
  console.log(`The file or directory "${path.basename(file)}" doesn't exist!`)
  process.exit(1)
}

serve(file, flags)
