const jsonwebtoken = require('jsonwebtoken')

const config = require('../../config')
const Users = require('../../models/users/users.model')
const userConstants = require('../../models/users/users.constants')
const inputService = require('../../services/input/input.service')
const mailService = require('../../services/mail/mail.service')
const validateService = require('../../services/validate/validate.service')
const passwordService = require('../../services/password/password.service')

const register = async (req, res) => {
  try {
    const isValidInput = inputService.validate('./users/users.register.input.schema.json', req)
    if (!isValidInput) {
      return res.status(400).json({ error: 'Bad request' })
    }
    const { body } = req
    const { user } = body
    const { email } = user
    const existingUser = await Users.findOne({
      where: {
        email
      }
    })
    if (existingUser) {
      return res.status(409).json({ error: 'Resource already exists' })
    }
    const validateToken = jsonwebtoken.sign({ email }, config.passport.secret, { expiresIn: '1h' })
    const sendMailResult = await mailService.send(
      config.nodemailer.auth.user,
      email,
      'Registration link',
      'Click on this link to register: ' + config.validateUrl + validateToken,
      '<p>Click on this <a href="' + config.validateUrl + validateToken + '">link</a> to register</p>'
    )
    return res.status(200).json({
      sendMailResult
    })
  } catch (e) {
    return res.status(500).json({ error: e.message })
  }
}

const validate = async (req, res) => {
  try {
    const isValidInput = inputService.validate('./users/users.validate.input.schema.json', req)
    if (!isValidInput) {
      return res.status(400).json({ error: 'Bad request' })
    }
    const { body } = req
    const { user, registrationToken } = body
    const { password } = user
    const token = jsonwebtoken.decode(registrationToken)
    if (!token) {
      return res.status(400).json({ error: 'Invalid token' })
    }
    if (new Date() > new Date(token.exp * 1000)) {
      return res.status(400).json({ error: 'Expired token' })
    }
    if (!validateService.isEmail(token.email)) {
      return res.status(400).json({ error: 'Invalid email' })
    }
    const existingUser = await Users.findOne({
      where: {
        email: token.email
      }
    })
    if (existingUser) {
      return res.status(409).json({ error: 'Resource already exists' })
    }
    const passwordHash = await passwordService.hash(password)
    const data = {
      email: token.email,
      passwordHash: passwordHash
    }
    const createdUser = await Users.create(data)
    return res.status(200).json({
      user: createdUser
    })
  } catch (e) {
    return res.status(500).json({ error: e.message })
  }
}

const create = async (req, res) => {
  try {
    const { user, body } = req
    if (![userConstants.role.ADMIN].includes(user.role)) {
      return res.status(403).json({ error: 'Unauthorized' })
    }
    const isValidInput = inputService.validate('./users/users.create.input.schema.json', req)
    if (!isValidInput) {
      return res.status(400).json({ error: 'Bad request' })
    }
    const { email, password, status, role } = body.user
    const existingUser = await Users.findOne({
      where: {
        email
      }
    })
    if (existingUser) {
      return res.status(409).json({ error: 'Resource already exists' })
    }
    const passwordHash = await passwordService.hash(password)
    const data = {
      email,
      passwordHash
    }
    if (status) {
      data.status = status
    }
    if (role) {
      data.role = role
    }
    const createdUser = await Users.create(data)
    return res.status(200).json({
      user: createdUser
    })
  } catch (e) {
    return res.status(500).json({ error: e.message })
  }
}

const getMany = async (req, res) => {
  const { user } = req
  const where = {}
  if (![userConstants.role.ADMIN].includes(user.role)) {
    where.id = user.id
  }
  try {
    Users.findAll({
      where
    }).then(users => {
      res.status(200).json(users)
    })
  } catch (e) {
    return res.status(500).json({ error: e.message })
  }
}

const getOne = async (req, res) => {
  const { user, params } = req
  const { id } = params
  if (![userConstants.role.ADMIN].includes(user.role)) {
    return res.status(403).json({ error: 'Unauthorized' })
  }
  try {
    Users.findOne({
      where: {
        id
      }
    }).then(user => {
      res.status(200).json(user)
    })
  } catch (e) {
    return res.status(500).json({ error: e.message })
  }
}

const controller = {
  register,
  validate,
  create,
  getMany,
  getOne
}

module.exports = controller
