const htmlPdf = require('html-pdf')
const qrCode = require('qrcode')

const config = require('../../config')

const generateQrCodeHtml = async url => {
  try {
    const qrCodeDataUrl = await qrCode.toDataURL(url)
    const qrCodeHtml = `<img src="${qrCodeDataUrl}" alt="QR code" />`
    return qrCodeHtml
  } catch (e) {
    console.error(e)
  }
}

const generateVerificationHtml = async url => {
  const qrCodeHtml = await generateQrCodeHtml(url)
  const link = `<a href="${url}" style="${config.pdf.style.verification.link}">${url}</a>`
  const verificationHtml = `<div style="${config.pdf.style.verification.wrapper}">${qrCodeHtml}<p style="${config.pdf.style.verification.text}">To verify this certificate, scan the QR code or open this link: <br>${link}</p>`
  return verificationHtml
}

const create = async (
  certificateHtml,
  sharingUuid,
  options = {
    format: 'A4',
    orientation: 'portrait'
  }
) => new Promise(async (resolve, reject) => {
  const url = `${config.client.url.share}${sharingUuid}`
  const verificationHtml = await generateVerificationHtml(url)
  const html = `<div style="${config.pdf.style.wrapper}">${certificateHtml}${verificationHtml}</div>`
  htmlPdf.create(html, options).toBuffer(async (err, pdfBuffer) => {
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

module.exports = {
  create
}
