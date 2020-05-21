const Signatures = require('../../models/signatures/signatures.model')
const usersConstants = require('../../models/users/users.constants')
const inputService = require('../../services/input/input.service')

const create = async (req, res) => {
  try {
    const { user, body } = req
    if (![
      usersConstants.role.ADMIN,
      usersConstants.role.MANAGER,
      usersConstants.role.ISSUER
    ].includes(user.role)) {
      return res.status(403).json({ error: 'Unauthorized' })
    }
    if (!inputService.validate(`${__dirname}/signatures.create.json`, req)) {
      return res.status(400).json({ error: 'Bad request' })
    }
    const created = await Signatures.create(body)
    return res.status(200).json(created)
  } catch (e) {
    return res.status(500).json({ error: e.message })
  }
}

const destroy = async (req, res) => {
  try {
    const { params, user } = req
    if (![
      usersConstants.role.ADMIN,
      usersConstants.role.MANAGER,
      usersConstants.role.ISSUER
    ].includes(user.role)) {
      return res.status(403).json({ error: 'Unauthorized' })
    }
    const { id } = params
    const result = await Signatures.destroy({ where: { id } })
    return res.status(200).json({ destroyedRows: result })
  } catch (e) {
    return res.status(500).json({ error: e.message })
  }
}

const getOne = async (req, res) => {
  try {
    const { params, user } = req
    const { id } = params
    if (![
      usersConstants.role.ADMIN,
      usersConstants.role.MANAGER,
      usersConstants.role.ISSUER
    ].includes(user.role)) {
      return res.status(403).json({ error: 'Unauthorized' })
    }
    const data = await Signatures.findOne({ where: { id } })
    res.status(200).json(data)
  } catch (e) {
    return res.status(500).json({ error: e.message })
  }
}

const getMany = async (req, res) => {
  try {
    const { user } = req
    if (![
      usersConstants.role.ADMIN,
      usersConstants.role.MANAGER,
      usersConstants.role.ISSUER
    ].includes(user.role)) {
      return res.status(403).json({ error: 'Unauthorized' })
    }
    const data = await Signatures.findAll()
    res.status(200).json(data)
  } catch (e) {
    return res.status(500).json({ error: e.message })
  }
}

const update = async (req, res) => {
  try {
    const { body, params, user } = req
    const { id } = params
    if (![
      usersConstants.role.ADMIN,
      usersConstants.role.MANAGER,
      usersConstants.role.ISSUER
    ].includes(user.role)) {
      return res.status(403).json({ error: 'Unauthorized' })
    }
    if (!inputService.validate(`${__dirname}/signatures.update.json`, req)) {
      return res.status(400).json({ error: 'Bad request' })
    }
    await Signatures.update(body, { where: { id } })
    const updated = await Signatures.findOne({ where: { id } })
    return res.status(200).json(updated)
  } catch (e) {
    return res.status(500).json({ error: e.message })
  }
}

const controller = {
  create,
  destroy,
  getMany,
  getOne,
  update
}

module.exports = controller
