const Revocations = require('../../models/revocations/revocations.model')
const Certificates = require('../../models/certificates/certificates.model')
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
    if (!inputService.validate(`${__dirname}/revocations.create.json`, req)) {
      return res.status(400).json({ error: 'Bad request' })
    }
    const { certificateId, blockcertsUuid } = body
    const where = {}
    if (certificateId) {
      where.id = certificateId
    }
    if (blockcertsUuid) {
      where.blockcertsUuid = blockcertsUuid
    }
    const certificate = await Certificates.scope('withJson').findOne({ where })
    if (certificate) {
      if (![
        usersConstants.role.ADMIN,
        usersConstants.role.MANAGER
      ].includes(user.role)) {
        if (certificate.getCreator().id !== user.id) {
          return res.status(403).json({ error: 'Unauthorized' })
        }
      }
      const created = await Revocations.create({
        creatorId: user.id,
        certificateId: certificate.id,
        blockcertsUuid: certificate.json.id
      })
      return res.status(200).json(created)
    } else if (blockcertsUuid) {
      const created = await Revocations.create({
        creatorId: user.id,
        blockcertsUuid
      })
      return res.status(200).json(created)
    } else {
      return res.status(400).json({ error: 'Bad request' })
    }
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
    const revocation = await Revocations.findOne({ where: { id } })
    if (revocation) {
      const certificate = revocation.getCertificate()
      if (certificate) {
        if (![
          usersConstants.role.ADMIN,
          usersConstants.role.MANAGER
        ].includes(user.role)) {
          if (certificate.getCreator().id !== user.id) {
            return res.status(403).json({ error: 'Unauthorized' })
          }
        }
        const result = await Revocations.destroy({ where: { id } })
        return res.status(200).json({ destroyedRows: result })
      }
    }
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
    const data = await Revocations.findAll()
    res.status(200).json(data)
  } catch (e) {
    return res.status(500).json({ error: e.message })
  }
}

const controller = {
  create,
  destroy,
  getMany
}

module.exports = controller
