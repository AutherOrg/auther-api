/* eslint-env jest */
const config = require('../../config')
const service = require('./mail.service')

test('Send email', async () => {
  const result = await service.send(
    'guillaume.duveau+auther-api-recipient@gmail.com',
    'test',
    {},
    []
  )
  expect(result).not.toHaveProperty('error')
})
