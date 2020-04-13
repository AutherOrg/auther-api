const jsonwebtoken = require('jsonwebtoken')

const config = require('../../../config')
const Users = require('../../../models/users/users.model')
const usersConstants = require('../../../models/users/users.constants')
const inputService = require('../../../services/input/input.service')
const passwordService = require('../../../services/password/password.service')
const mailService = require('../../../services/mail/mail.service')

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
    const isValidInput = inputService.validate('./auth/local/local.auth.authenticateFromPermanentToken.input.schema.json', req)
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

const setPassword = async (req, res) => {
  try {
    const isValidInput = inputService.validate('./auth/local/local.auth.setPassword.input.schema.json', req)
    if (!isValidInput) {
      return res.status(400).json({ error: 'Bad request' })
    }
    const { body } = req
    const { email, password } = body
    const passwordToken = jsonwebtoken.sign({ email, password }, config.passport.secret, { expiresIn: '1h' })
    const sendMailResult = await mailService.send(
      config.nodemailer.from,
      email,
      `[${config.applicationName}] Validate your new password`,
      `Hello,\r\n\r\nPlease click on this link to validate your new password:\r\n${config.validatePasswordUrl}${passwordToken}\r\n\r\nThe ${config.applicationName} team.`,
      ''
    )
    return res.status(200).json({
      passwordToken,
      sendMailResult
    })
  } catch (e) {
    return res.status(500).json({ error: e.message })
  }
}

const validatePassword = async (req, res) => {
  try {
    const isValidInput = inputService.validate('./auth/local/local.auth.validatePassword.input.schema.json', req)
    if (!isValidInput) {
      return res.status(400).json({ error: 'Bad request' })
    }
    const { body } = req
    const { passwordToken } = body
    const decodedToken = jsonwebtoken.decode(passwordToken)
    if (!decodedToken) {
      return res.status(400).json({ error: 'Invalid password token' })
    }
    const existingUser = await Users.findOne({
      where: {
        email: decodedToken.email
      }
    })
    if (!existingUser) {
      return res.status(403).json({ error: 'Unauthorized' })
    }
    const passwordHash = await passwordService.hash(decodedToken.password)
    const data = {
      passwordHash
    }
    if (existingUser.status === usersConstants.status.INACTIVE) {
      data.status = usersConstants.status.ACTIVE
    }
    Users.update(data, {
      where: {
        id: existingUser.id
      }
    })
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
  authenticateFromPermanentToken,
  setPassword,
  validatePassword
}
