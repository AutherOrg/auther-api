const { Op } = require('sequelize')
const jsonwebtoken = require('jsonwebtoken')

const config = require('../../config')
const Certificates = require('../../models/certificates/certificates.model')
const certificatesConstants = require('../../models/certificates/certificates.constants')
const Users = require('../../models/users/users.model')
const userConstants = require('../../models/users/users.constants')
const inputService = require('../../services/input/input.service')
const blockcertsSchemaService = require('../../services/schemas/blockcerts.schema.service')
const mailService = require('../../services/mail/mail.service')

const createWithRecipient = async (req, res) => {
  try {
    const { user, body } = req
    if (![
      userConstants.role.ADMIN,
      userConstants.role.MANAGER,
      userConstants.role.ISSUER
    ].includes(user.role)) {
      return res.status(403).json({ error: 'Unauthorized' })
    }
    const isValidInput = inputService.validate('./certificates/certificates.createWithRecipient.input.schema.json', req)
    if (!isValidInput) {
      return res.status(400).json({ error: 'Bad request' })
    }
    const { certificate } = body
    const isValid = config.validateCertificates ? await blockcertsSchemaService.validate(certificate) : true
    if (isValid) {
      const email = certificate.recipient.identity.toLowerCase()
      // Sign a permanent token.
      const permanentToken = jsonwebtoken.sign({ email }, config.passport.secret)
      // Find out if the recipient user already exists.
      let recipient = await Users.findOne({
        where: {
          email
        }
      })
      // Create a new recipient user.
      if (!recipient) {
        recipient = await Users.create({
          email,
          status: userConstants.status.INACTIVE,
          role: userConstants.role.RECIPIENT
        })
      }
      // Create certificate.
      const createdCertificate = await Certificates.create({
        json: certificate,
        recipientId: recipient.id,
        issuerId: req.user.id
      })
      // Notify recipient.
      const sendMailResult = await mailService.send(
        config.nodemailer.from,
        email,
        `[${config.applicationName}] You have a new certificate`,
        `Hello,\r\n\r\nA new certificate has been issued to you.\r\n\r\nClick on this link to manage it:\r\n${config.permanentTokenLoginUrl}${permanentToken}\r\n\r\nThis will allow you to easily share it online with your contacts. Your certificate is attached in this email as well, as a JSON file. You can alternatively view it on https://www.blockcerts.org/ and send it to your contacts.\r\n\r\nThe ${config.applicationName} team.`,
        '', [{
          filename: `${createdCertificate.json.badge.name}-${createdCertificate.json.recipientProfile.name}.json`,
          content: JSON.stringify(createdCertificate.json)
        }]
      )
      return res.status(200).json({
        certificate: createdCertificate,
        sendMailResult
      })
    }
    return res.status(400).json({
      error: 'Invalid certificate',
      certificate
    })
  } catch (e) {
    console.log(e)
    return res.status(500).json({ error: e.message })
  }
}

const destroy = async (req, res) => {
  try {
    const { params, user } = req
    if (![userConstants.role.RECIPIENT].includes(user.role)) {
      return res.status(403).json({ error: 'Unauthorized' })
    }
    const { id } = params
    const result = await Certificates.destroy(
      {
        where: {
          id,
          recipientId: user.id
        }
      }
    )
    return res.status(200).json(result)
  } catch (e) {
    return res.status(500).json({ error: e.message })
  }
}

const getAll = async (req, res) => {
  try {
    const { user } = req
    const where = {}
    if (![
      userConstants.role.ADMIN,
      userConstants.role.MANAGER
    ].includes(user.role)) {
      where[Op.or] = [
        { recipientId: user.id },
        { issuerId: user.id }
      ]
    }
    const certificates = await Certificates.findAll({
      where,
      order: [
        ['id', 'DESC']
      ],
      include: [
        {
          model: Users,
          as: 'Recipient'
        },
        {
          model: Users,
          as: 'Issuer'
        }
      ]
    })
    return res.status(200).json(certificates)
  } catch (e) {
    return res.status(500).json({ error: e.message })
  }
}

const getOne = async (req, res) => {
  try {
    const { user, params } = req
    const { id } = params
    if (![
      userConstants.role.ADMIN,
      userConstants.role.MANAGER,
      userConstants.role.ISSUER,
      userConstants.role.RECIPIENT
    ].includes(user.role)) {
      return res.status(403).json({ error: 'Unauthorized' })
    }
    const where = {
      id
    }
    if (![
      userConstants.role.ADMIN,
      userConstants.role.MANAGER
    ].includes(user.role)) {
      where[Op.or] = [
        { recipientId: user.id },
        { issuerId: user.id }
      ]
    }
    const certificate = await Certificates.findOne({
      where
    })
    return res.status(200).json(certificate)
  } catch (e) {
    return res.status(500).json({ error: e.message })
  }
}

const getShared = async (req, res) => {
  try {
    const certificate = await Certificates.findOne({
      where: {
        uuid: req.params.uuid
      },
      attributes: [
        'status',
        'uuid',
        'json'
      ]
    })
    if (certificate.status === certificatesConstants.status.SHARED) {
      return res.status(200).json(certificate)
    } else {
      return res.status(403).json({ error: 'Unauthorized: this certificate is not shared' })
    }
  } catch (e) {
    return res.status(500).json({ error: e.message })
  }
}

const update = async (req, res) => {
  try {
    const { body, params, user } = req
    if (![userConstants.role.RECIPIENT].includes(user.role)) {
      return res.status(403).json({ error: 'Unauthorized' })
    }
    const isValidInput = inputService.validate('./certificates/certificates.update.input.schema.json', req)
    if (!isValidInput) {
      return res.status(400).json({ error: 'Bad request' })
    }
    const { status } = body
    const { id } = params
    await Certificates.update(
      { status },
      {
        where: {
          id,
          recipientId: user.id
        }
      }
    )
    const updated = await Certificates.findOne({
      where: {
        id
      }
    })
    return res.status(200).json(updated)
  } catch (e) {
    return res.status(500).json({ error: e.message })
  }
}

module.exports = {
  createWithRecipient,
  destroy,
  getAll,
  getOne,
  getShared,
  update
}
