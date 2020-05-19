const Models = require('../../models/models/models.model')
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
    if (!inputService.validate(`${__dirname}/models.create.json`, req)) {
      return res.status(400).json({ error: 'Bad request' })
    }
    const { name, description, template, signatures, image } = body
    // signatures.forEach(async id => {
    //   const count = await Signatures.count({
    //     where: { id }
    //   })
    //   if (count === 0) {
    //     return res.status(400).json({ error: 'Bad request' })
    //   }
    // })
    const data = {
      name,
      description,
      template,
      image
    }
    const created = await Models.create(data)
    created.setSignatures(signatures)
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
    const result = await Models.destroy({ where: { id } })
    return res.status(200).json({ destroyedRows: result })
  } catch (e) {
    return res.status(500).json({ error: e.message })
  }
}

const getMany = async (req, res) => {
  try {
    const { query, user } = req
    if (![
      usersConstants.role.ADMIN,
      usersConstants.role.MANAGER,
      usersConstants.role.ISSUER
    ].includes(user.role)) {
      return res.status(403).json({ error: 'Unauthorized' })
    }
    const options = {}
    if (query.withSignatures) {
      options.include = Signatures
    }
    const data = await Models.findAll(options)
    res.status(200).json(data)
  } catch (e) {
    return res.status(500).json({ error: e.message })
  }
}

const getOne = async (req, res) => {
  try {
    const { query, params, user } = req
    const { id } = params
    if (![
      usersConstants.role.ADMIN,
      usersConstants.role.MANAGER,
      usersConstants.role.ISSUER
    ].includes(user.role)) {
      return res.status(403).json({ error: 'Unauthorized' })
    }
    const options = { where: { id } }
    if (query.withSignatures) {
      options.include = Signatures
    }
    const data = await Models.findOne(options)
    return res.status(200).json(data)
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
    if (!inputService.validate(`${__dirname}/models.update.json`, req)) {
      return res.status(400).json({ error: 'Bad request' })
    }
    const { name, description, template, signatures, image } = body
    const data = {
      name,
      description,
      template,
      image
    }
    await Models.update(data, { where: { id } })
    const updated = await Models.findOne({ where: { id } })
    if (signatures) {
      // signatures.forEach(async id => {
      //   const count = await Signatures.count({
      //     where: { id }
      //   })
      //   if (count === 0) {
      //     return res.status(400).json({ error: 'Bad request' })
      //   }
      // })
      updated.setSignatures(signatures)
    }
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
