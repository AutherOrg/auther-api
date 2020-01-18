const Certificates = require('../../models/certificates/certificates.model')
const userConstants = require('../../models/users/users.constants')
const inputService = require('../../services/input/input.service')
const blockcertsSchemaService = require('../../services/schemas/blockcerts.schema.service')

const create = async (req, res) => {
  try {
    const { user, body } = req
    if (![userConstants.roles.ADMIN, userConstants.roles.ISSUER].includes(user.role)) {
      return res.status(403).json({ error: 'Unauthorized' })
    }
    const isValidInput = inputService.validate('./certificates/certificates.create.input.schema.json', req)
    if (!isValidInput) {
      return res.status(400).json({ error: 'Bad request' })
    }
    const { certificates } = body
    const areValid = await Promise.all(
      certificates.map(async certificate => {
        const isValid = await blockcertsSchemaService.validate(certificate)
        return isValid
      })
    )
    const areAllValid = areValid.every(isValid => isValid)
    if (areAllValid) {
      const createdCertificates = await Promise.all(
        certificates.map(async certificate => {
          const createdCertificate = await Certificates.create({
            json: certificate,
            user_id: req.user.id
          })
          return createdCertificate
        })
      )
      return res.status(200).json({
        certificates: createdCertificates
      })
    }
    return res.status(400).json({
      error: 'Some unsigned certificates are not valid',
      areValid,
      certificates
    })
  } catch (e) {
    return res.status(500).json({ error: e.message })
  }
}

const getMany = async (req, res) => {
  try {
    const { user } = req
    const where = {}
    if (![userConstants.roles.ADMIN].includes(user.role)) {
      where.user_id = user.id
    }
    const certificates = await Certificates.findAll({
      where
    })
    return res.status(200).json(certificates)
  } catch (e) {
    return res.status(500).json({ error: e.message })
  }
}

const getOne = async (req, res) => {
  try {
    const certificate = await Certificates.find({
      where: {
        uuid: req.params.uuid
      }
    })
    return res.status(200).json(certificate)
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
