const Users = require('../../models/users/users.model')
const userConstants = require('../../models/users/users.constants')
const inputService = require('../../services/input/input.service')
const passwordService = require('../../services/password/password.service')

const create = async (req, res) => {
  try {
    const { user, body } = req
    if (![userConstants.role.ADMIN].includes(user.role)) {
      return res.status(403).json({ error: 'Unauthorized' })
    }
    if (!inputService.validate(`${__dirname}/users.create.json`, req)) {
      return res.status(400).json({ error: 'Bad request' })
    }
    const { email, password, status, role } = body
    const existingUser = await Users.findOne({ where: { email } })
    if (existingUser) {
      return res.status(409).json({ error: 'Resource already exists' })
    }
    const passwordHash = await passwordService.hash(password)
    const data = {
      email,
      status,
      role,
      passwordHash
    }
    const createdUser = await Users.create(data)
    return res.status(200).json(createdUser)
  } catch (e) {
    return res.status(500).json({ error: e.message })
  }
}

const getMany = async (req, res) => {
  try {
    const { query, user } = req
    if (![userConstants.role.ADMIN].includes(user.role)) {
      return res.status(403).json({ error: 'Unauthorized' })
    }
    const where = {}
    if (query.withoutRecipients) {
      where.role = [
        userConstants.role.ADMIN,
        userConstants.role.MANAGER,
        userConstants.role.ISSUER
      ]
    }
    const data = await Users.findAll({
      where,
      order: [
        ['id', 'DESC']
      ]
    })
    res.status(200).json(data)
  } catch (e) {
    return res.status(500).json({ error: e.message })
  }
}

const getOne = async (req, res) => {
  try {
    const { user, params } = req
    const { id } = params
    if (![userConstants.role.ADMIN].includes(user.role)) {
      return res.status(403).json({ error: 'Unauthorized' })
    }
    const data = await Users.findOne({ where: { id } })
    res.status(200).json(data)
  } catch (e) {
    return res.status(500).json({ error: e.message })
  }
}

const controller = {
  create,
  getMany,
  getOne
}

module.exports = controller
