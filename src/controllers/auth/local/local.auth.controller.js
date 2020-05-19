const jsonwebtoken = require('jsonwebtoken')

const config = require('../../../config')
const Users = require('../../../models/users/users.model')
const usersConstants = require('../../../models/users/users.constants')
const inputService = require('../../../services/input/input.service')
const passwordService = require('../../../services/password/password.service')
const mailService = require('../../../services/mail/mail.service')

const authenticate = async (req, res) => {
  try {
    if (!inputService.validate(`${__dirname}/local.auth.authenticate.json`, req)) {
      return res.status(400).json({ error: 'Bad request' })
    }
    const { body } = req
    const { email, password } = body
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
      { expiresIn: '30 days' }
    )
    const filteredExistingUser = await Users.findOne({
      where: {
        email
      }
    })
    return res.status(200).json({
      user: filteredExistingUser,
      token
    })
  } catch (e) {
    return res.status(500).json({ error: e.message })
  }
}

const get = async (req, res) => {
  try {
    const { user } = req
    const authenticatedUser = await Users.findOne({
      where: {
        id: user.id
      }
    })
    if (!authenticatedUser) {
      return res.status(403).json({ error: 'Unauthorized' })
    }
    return res.status(200).json(authenticatedUser)
  } catch (e) {
    return res.status(500).json({ error: e.message })
  }
}

const resetPassword = async (req, res) => {
  try {
    if (!inputService.validate(`${__dirname}/local.auth.resetPassword.json`, req)) {
      return res.status(400).json({ error: 'Bad request' })
    }
    const { body } = req
    const { email } = body
    const existingUser = await Users.findOne({
      where: {
        email
      }
    })
    if (existingUser) {
      const resetPasswordToken = jsonwebtoken.sign({ id: existingUser.id }, config.passport.secret, { expiresIn: '1h' })
      const sendMailResult = await mailService.send(
        email,
        `[${config.applicationName}] Reset password`,
        `Hello,\r\n\r\nPlease click on this link to set a new password:\r\n${config.resetPasswordProcessUrl}${resetPasswordToken}\r\n\r\nThe ${config.applicationName} team.`,
        ''
      )
      return res.status(200).json({
        sendMailResult
      })
    } else {
      return res.status(403).json({ error: 'Unauthorized' })
    }
  } catch (e) {
    return res.status(500).json({ error: e.message })
  }
}

const resetPasswordProcess = async (req, res) => {
  try {
    const { user } = req
    const existingUser = await Users.findOne({
      where: {
        id: user.id
      }
    })
    if (existingUser) {
      const data = {
        status: usersConstants.status.INACTIVE,
        passwordHash: ''
      }
      Users.update(data, {
        where: {
          id: user.id
        }
      })
      return res.status(200).json({
        user
      })
    } else {
      return res.status(403).json({ error: 'Unauthorized' })
    }
  } catch (e) {
    return res.status(500).json({ error: e.message })
  }
}

const setPassword = async (req, res) => {
  try {
    const { body, user } = req
    if (!inputService.validate(`${__dirname}/local.auth.setPassword.json`, req)) {
      return res.status(400).json({ error: 'Bad request' })
    }
    const { password } = body
    const passwordHash = await passwordService.hash(password)
    const data = {
      status: usersConstants.status.ACTIVE,
      passwordHash
    }
    Users.update(data, {
      where: {
        id: user.id
      }
    })
    return res.status(200).json({
      user
    })
  } catch (e) {
    return res.status(500).json({ error: e.message })
  }
}

module.exports = {
  authenticate,
  get,
  resetPassword,
  resetPasswordProcess,
  setPassword
}
