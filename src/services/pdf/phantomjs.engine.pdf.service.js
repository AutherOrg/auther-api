const htmlPdf = require('html-pdf')

const config = require('../../config')

const html2pdf = (certificateHtml, verificationHtml) => {
  return new Promise((resolve, reject) => {
    const html = `<div style="${config.pdf.style.wrapper}">${certificateHtml}${verificationHtml}</div>`
    htmlPdf.create(html, {
      html: {
        zoom: config.pdf.zoom
      },
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
