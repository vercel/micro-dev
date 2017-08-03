module.exports = (message, errorCode) => {
  const repo = errorCode === 'watch-flags' ? 'micro-dev' : 'micro'

  console.error(message)
  console.error(`Read more here: https://err.sh/${repo}/${errorCode}`)
}
