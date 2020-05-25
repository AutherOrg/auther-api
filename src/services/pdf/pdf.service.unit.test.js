/* eslint-env jest */
const fs = require('fs')

const service = require('./pdf.service')
const certificateHtml = fs.readFileSync('./src/services/pdf/pdf.service.unit.test.html', 'utf8')
const Certificates = require('../../models/certificates/certificates.model')

test('Generate PDF', async () => {
  const result = await service.html2pdf(certificateHtml, 'UUID')
  expect(result).not.toHaveProperty('error')
  await Certificates.update(
    { pdf: result.pdfBase64 },
    { where: { id: 1 } }
  )
})
