module.exports = (message, errorCode) => {
  console.log(message)

  if (errorCode) {
    console.log(`Read more here: https://err.sh/micro/${errorCode}`)
  }
}
