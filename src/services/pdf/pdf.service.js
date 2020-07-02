
const qrCode = require('qrcode')

const config = require('../../config')
const engine = require('./phantomjs.engine.pdf.service')

const generateQrCodeHtml = async url => {
  try {
    const qrCodeDataUrl = await qrCode.toDataURL(url)
    const qrCodeHtml = `<img src="${qrCodeDataUrl}" alt="QR code" style="height: 50px; width: auto;" />`
    return qrCodeHtml
  } catch (e) {
    console.error(e)
  }
}

const generateVerificationHtml = async url => {
  const qrCodeHtml = await generateQrCodeHtml(url)
  const verificationLink = `<a href="${url}" style="${config.pdf.style.verification.link}">${url}</a>`
  const verificationTextAndLink = `<div style="${config.pdf.style.verification.text}">To verify this certificate, scan the QR code or open this link: ${verificationLink}</div>`
  const autherLink = `<a href="https://auther.org" style="${config.pdf.style.verification.link}">Auther</a>`
  const autherTextAndLink = `<div style="${config.pdf.style.verification.text} margin-top: 8px; text-align: right;">Powered by ${autherLink}, an opensource implementation of Blockcerts</div>`
  const verificationAndAuther = `<div>${verificationTextAndLink}${autherTextAndLink}</div>`
  const verificationHtml = `<div style="${config.pdf.style.verification.wrapper}">${qrCodeHtml}${verificationAndAuther}</div>`
  return verificationHtml
}

const html2pdf = async (certificateHtml, sharingUuid) => {
  const sharingUrl = `${config.client.url.share}${sharingUuid}`
  const verificationHtml = await generateVerificationHtml(sharingUrl)
  return engine.html2pdf(certificateHtml, verificationHtml)
}

module.exports = {
  html2pdf
}
