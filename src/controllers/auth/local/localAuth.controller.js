const jsonwebtoken = require('jsonwebtoken')

const config = require('../../../config')
const Users = require('../../../models/users/users.model')
const inputService = require('../../../services/input/input.service')
const passwordService = require('../../../services/password/password.service')
const usersConstants = require('../../../models/users/users.constants')

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

const authenticateFromPermanentToken = async (req, res) => {
  try {
    const isValidInput = inputService.validate('./auth/local.auth.authenticateFromPermanentToken.input.schema.json', req)
    if (!isValidInput) {
      return res.status(400).json({ error: 'Bad request' })
    }
    const { body } = req
    const { permanentToken } = body
    const decodedToken = jsonwebtoken.decode(permanentToken)
    if (!decodedToken) {
      return res.status(400).json({ error: 'Invalid permanent token' })
    }
    const existingUser = await Users.findOne({
      where: {
        email: decodedToken.email
      }
    })
    if (!existingUser) {
      return res.status(403).json({ error: 'Unauthorized' })
    }
    if (existingUser.status === usersConstants.status.INACTIVE) {
      Users.update({
        status: usersConstants.status.ACTIVE
      }, {
        where: {
          id: existingUser.id
        }
      })
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
  authenticate,
  authenticateFromPermanentToken
}
