/* eslint-env jest */
const service = require('./mail.service')

const name = 'Guillaume'

test('Send email', async () => {
  const result = await service.send(
    'guillaume.duveau+openblockcerts-api-admin@gmail.com',
    'guillaume.duveau+openblockcerts-api-recipient@gmail.com',
    'Email test',
    `Hello ${name},\r\n\r\nHow are you?`,
    '',
    '',
    ''
  )
  expect(result).not.toHaveProperty('error')
})
