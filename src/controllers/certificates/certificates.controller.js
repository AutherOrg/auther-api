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
    if (![userConstants.role.ADMIN, userConstants.role.ISSUER].includes(user.role)) {
      return res.status(403).json({ error: 'Unauthorized' })
    }
    const isValidInput = inputService.validate('./certificates/certificates.createWithRecipient.input.schema.json', req)
    if (!isValidInput) {
      return res.status(400).json({ error: 'Bad request' })
    }
    const { certificate } = body
    const isValid = await blockcertsSchemaService.validate(certificate)
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
        config.nodemailer.auth.user,
        email,
        `[${config.applicationName}] You have a new certificate`,
        `A new certificate has been issued to you. Click on this link to manage it: ${config.permanentTokenLoginUrl}${permanentToken} This will allow you to easily share it online with your contacts. Your certificate is attached in this email as well, as a JSON file. You can alternatively view it on https://www.blockcerts.org/ and send it to your contacts.`,
        '<p>TODO html</p>'
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
    return res.status(500).json({ error: e.message })
  }
}

const getAll = async (req, res) => {
  try {
    const { user } = req
    const where = {}
    if (![userConstants.role.ADMIN].includes(user.role)) {
      where[Op.or] = [
        { recipientId: user.id },
        { issuerId: user.id }
      ]
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
    const { user, params } = req
    const { id } = params
    if (![userConstants.role.ADMIN, userConstants.role.ISSUER, userConstants.role.RECIPIENT].includes(user.role)) {
      return res.status(403).json({ error: 'Unauthorized' })
    }
    const where = {
      id
    }
    if (![userConstants.role.ADMIN].includes(user.role)) {
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
    const certificate = await Certificates.find({
      where: {
        uuid: req.params.uuid
      }
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

module.exports = {
  createWithRecipient,
  getAll,
  getOne,
  getShared
}
