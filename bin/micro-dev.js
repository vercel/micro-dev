#!/usr/bin/env node

// Packages
const mri = require('mri')

// Utilities
const showHelp = require('../lib/help')
const {version} = require('../package')

const flags = mri(process.argv.slice(2), {
  boolean: [
    'help',
    'version'
  ],
  alias: {
    h: 'help',
    v: 'version'
  },
  unknown: showHelp
})

// Print out the package's version when
// `--version` or `-v` are used
if (flags.version) {
  console.log(version)
  process.exit(1)
}

// When `-h` or `--help` are used, print out
// the usage information
if (flags.help) {
  showHelp()
}
