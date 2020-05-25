const htmlPdf = require('html-pdf')

const html2pdf = (certificateHtml, verificationHtml) => {
  return new Promise((resolve, reject) => {
    const html = `<div style="height: 100%; display: flex; flex-direction: column; justify-content: center;">${certificateHtml}${verificationHtml}</div>`
    htmlPdf.create(html, {
      format: 'A4',
      orientation: 'landscape',
      border: '1cm'
    }).toBuffer(async (err, pdfBuffer) => {
      if (err) {
        reject(err)
      } else {
        const pdfBase64 = `data:application/pdf;base64,${pdfBuffer.toString('base64')}`
        resolve({
          pdfBase64,
          pdfBuffer
        })
      }
    })
  })
}

module.exports = {
  html2pdf
}
