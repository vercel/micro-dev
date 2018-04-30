const serve = require('./serve')

module.exports = (file, flags, cbStarted) =>
  serve(file, flags, false, cbStarted)
