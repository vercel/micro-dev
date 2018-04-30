const serve = require('./serve')

module.exports = (file, flags, cbBeforeStart) =>
  serve(file, flags, false, cbBeforeStart)
