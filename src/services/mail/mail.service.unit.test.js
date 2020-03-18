/* eslint-env jest */
const service = require('./mail.service')

test('Send email', async () => {
  const result = await service.send(
    'guillaume.duveau+openblockcerts-api-admin@gmail.com',
    'guillaume.duveau+openblockcerts-api-recipient@gmail.com',
    'Email test',
    'Hello',
    '',
    '',
    ''
  )
  expect(result).not.toHaveProperty('error')
})
