
const puppeteer = require('puppeteer')
const qrCode = require('qrcode')

const config = require('../../config')

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

const create = async (certificateHtml, sharingUuid) => {
  const browser = await puppeteer.launch({
    headless: true
  })
  const page = await browser.newPage()
  const url = `${config.client.url.share}${sharingUuid}`
  const verificationHtml = await generateVerificationHtml(url)
  const html = `<div style="height: calc(100vh - 20px); display: flex; flex-direction: column; justify-content: center;">${certificateHtml}</div>`
  await page.setContent(html)
  const pdfBuffer = await page.pdf({
    format: 'A4',
    landscape: true,
    printBackground: true,
    displayHeaderFooter: true,
    headerTemplate: `${config.application.name}`,
    footerTemplate: verificationHtml,
    margin: {
      bottom: 140,
      left: 50,
      right: 50,
      top: 50
    }
  })
  await browser.close()
  const pdfBase64 = `data:application/pdf;base64,${pdfBuffer.toString('base64')}`
  return {
    pdfBase64,
    pdfBuffer
  }
}

module.exports = {
  create
}
