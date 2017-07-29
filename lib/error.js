module.exports = (message, errorCode) => {
  console.error(message)
  console.error(`Read more here: https://err.sh/micro/${errorCode}`)
}
