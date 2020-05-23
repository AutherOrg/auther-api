const htmlPdf = require('html-pdf')

const create = async (html, options = {
  format: 'A4',
  orientation: 'portrait'
}) => new Promise((resolve, reject) => {
  htmlPdf.create(html, options).toFile('./tmp/certificate.pdf', (err, res) => {
    if (err) {
      reject(err)
    } else {
      resolve(res)
    }
  })
})

module.exports = {
  create
}
