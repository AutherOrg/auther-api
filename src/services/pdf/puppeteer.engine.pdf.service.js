const puppeteer = require('puppeteer')

const html2pdf = async (certificateHtml, verificationHtml) => {
  const browser = await puppeteer.launch({
    headless: true
  })
  const page = await browser.newPage()
  const html = `<div style="height: calc(100vh - 20px); display: flex; flex-direction: column; justify-content: center;">${certificateHtml}</div>`
  await page.setContent(html)
  const pdfBuffer = await page.pdf({
    format: 'A4',
    landscape: true,
    printBackground: true,
    displayHeaderFooter: true,
    headerTemplate: 'Auther',
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
  html2pdf
}
