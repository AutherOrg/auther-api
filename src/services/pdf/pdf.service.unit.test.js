/* eslint-env jest */
const fs = require('fs')

// const Certificates = require('../../models/certificates/certificates.model')

const service = require('./pdf.service')
const certificateHtml = fs.readFileSync('./src/services/pdf/pdf.service.unit.test.html', 'utf8')
const url = 'https://auther.org'

test('Generate PDF', async () => {
  const result = await service.create(certificateHtml, url)
  expect(result).not.toHaveProperty('error')
  expect(result.pdfBase64.substring(0, 28)).toBe('data:application/pdf;base64,')
  // await Certificates.update(
  //   { pdf: result.pdfBase64 },
  //   { where: { id: 1 } }
  // )
})
