/* eslint-env jest */
const service = require('./mail.service')

test('Send email', async () => {
  const result = await service.send(
    'guillaume.duveau+auther-api-recipient@gmail.com',
    'Email test',
    'How are you?',
    '',
    '',
    ''
  )
  expect(result).not.toHaveProperty('error')
})
