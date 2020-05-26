const htmlPdf = require('html-pdf')

const config = require('../../config')

const html2pdf = (certificateHtml, verificationHtml) => {
  return new Promise((resolve, reject) => {
    const html = `<html style="height: 0; transform-origin: 0 0; -webkit-transform-origin: 0 0; transform: scale(0.53); -webkit-transform: scale(0.53)";><body style="font-size: 50%;"><div style="${config.pdf.style.wrapper}">${certificateHtml}${verificationHtml}</div></body></html>`
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
