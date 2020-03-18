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
  expect(result).toHaveProperty('accepted')
  expect(result.accepted).toHaveLength(1)
  expect(result).toHaveProperty('rejected')
  expect(result.rejected).toHaveLength(0)
})
