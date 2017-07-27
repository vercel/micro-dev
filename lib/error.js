module.exports = (message, errorCode) => {
  console.log(`micro-dev: ${message}`)

  if (errorCode) {
    console.log(`micro-dev: https://err.sh/micro/${errorCode}`)
  }
}
