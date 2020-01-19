const jsonwebtoken = require('jsonwebtoken')

const config = require('../../../config')
const Users = require('../../../models/users/users.model')
const inputService = require('../../../services/input/input.service')
const passwordService = require('../../../services/password/password.service')

const authenticate = async (req, res) => {
  try {
    const isValidInput = inputService.validate('./auth/local/local.auth.authenticate.input.schema.json', req)
    if (!isValidInput) {
      return res.status(400).json({ error: 'Bad request' })
    }
    const { body } = req
    const { user } = body
    const { email, password } = user
    const existingUser = await Users.scope('withPasswordHash').findOne({
      where: {
        email
      }
    })
    if (!existingUser) {
      return res.status(403).json({ error: 'Unauthorized' })
    }
    const verifiedPassword = await passwordService.compare(password, existingUser.passwordHash)
    if (!verifiedPassword) {
      return res.status(403).json({ error: 'Unauthorized' })
    }
    const token = jsonwebtoken.sign(
      { id: existingUser.id },
      config.passport.secret,
      { expiresIn: '24h' }
    )
    return res.status(200).json({
      user: existingUser,
      token
    })
  } catch (e) {
    return res.status(500).json({ error: e.message })
  }
}

module.exports = {
  authenticate
}
