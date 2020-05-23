/* eslint-env jest */
const fs = require('fs')

const service = require('./pdf.service')
const html = fs.readFileSync('./src/services/pdf/pdf.service.unit.test.html', 'utf8')

test('Generate PDF in ./tmp/certificate.pdf', async () => {
  const result = await service.create(html)
  expect(result).not.toHaveProperty('error')
})
