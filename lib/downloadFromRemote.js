const download = require('download-git-repo')

module.exports = function downloadFromRemote (url, name) {
  return new Promise((resolve, reject) => {
    download(`direct:${url}`, name, { clone: true }, function (err) {
      if (err) {
        reject(err)
        return
      }
      resolve()
    })
  })
}