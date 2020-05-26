/* eslint-env jest */
const fs = require('fs')

const service = require('./pdf.service')
const certificateHtml = fs.readFileSync('./src/services/pdf/pdf.service.unit.test.html', 'utf8')

test('Generate PDF', async () => {
  const result = await service.html2pdf(certificateHtml, 'UUID')
  expect(result).not.toHaveProperty('error')
})
