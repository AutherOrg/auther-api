
const qrCode = require('qrcode')

const config = require('../../config')
const phantomjs = require('./phantomjs.engine.pdf.service')
// const puppeteer = require('./puppeteer.engine.pdf.service')
const engine = phantomjs

const generateQrCodeHtml = async url => {
  try {
    const qrCodeDataUrl = await qrCode.toDataURL(url, { width: 100 })
    const qrCodeHtml = `<img src="${qrCodeDataUrl}" alt="QR code" />`
    return qrCodeHtml
  } catch (e) {
    console.error(e)
  }
}

const generateVerificationHtml = async url => {
  const qrCodeHtml = await generateQrCodeHtml(url)
  const link = `<a href="${url}" style="color: #000000;">${url}</a>`
  const verificationHtml = `<div style="width: 100%; display: flex; justify-content: center; align-items: center; ">${qrCodeHtml}<div><div style="font-size: 8px; margin: 8px;">To verify this certificate, scan the QR code or open this link: ${link}</div><div style="font-size: 8px; margin: 8px; text-align: right;">Powered by <a href="https://auther.org" style="color: #000000;">Auther</a>, an opensource implementation of Blockcerts</div></div></div>`
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
