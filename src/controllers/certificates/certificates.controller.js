const { Op } = require('sequelize')
const jsonwebtoken = require('jsonwebtoken')

const config = require('../../config')
const Certificates = require('../../models/certificates/certificates.model')
const Users = require('../../models/users/users.model')
const certificatesConstants = require('../../models/certificates/certificates.constants')
const userConstants = require('../../models/users/users.constants')
const inputService = require('../../services/input/input.service')
const blockcertsSchemaService = require('../../services/schemas/blockcerts.schema.service')
const pdfService = require('../../services/pdf/pdf.service')
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
    if (!inputService.validate(`${__dirname}/certificates.createWithRecipient.json`, req)) {
      return res.status(400).json({ error: 'Bad request' })
    }
    const { certificate } = body
    const isValid = config.validateCertificates ? await blockcertsSchemaService.validate(certificate) : true
    if (isValid) {
      const email = certificate.recipient.identity.toLowerCase()
      // Find out if the recipient user already exists.
      let recipient = await Users.findOne({ where: { email } })
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
        name: certificate.badge.name,
        recipientId: recipient.id,
        creatorId: req.user.id,
        blockcertsUuid: certificate.id,
        json: certificate
      })
      // Generate PDF.
      const { pdfBase64, pdfBuffer } = await pdfService.html2pdf(certificate.displayHtml, createdCertificate.sharingUuid)
      await createdCertificate.update({ pdf: pdfBase64 })
      // Sign a token.
      const token = jsonwebtoken.sign({ id: recipient.id }, config.passport.secret, { expiresIn: '30 days' })
      // Notify recipient.
      const sendMailResult = await mailService.send(
        email,
        'certificate', {
          manageLink: `${config.client.url.loginFromToken}${token}`
        }, [
          {
            filename: `${createdCertificate.json.badge.name}-${createdCertificate.json.recipientProfile.name}.pdf`,
            content: Buffer.from(pdfBuffer, 'base64'),
            contentType: 'application/pdf'
          },
          {
            filename: `${createdCertificate.json.badge.name}-${createdCertificate.json.recipientProfile.name}.json`,
            content: JSON.stringify(createdCertificate.json)
          }
        ]
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
    const { query, user } = req
    const where = {}
    if ([userConstants.role.ADMIN, userConstants.role.MANAGER].includes(user.role)) {
      if (query.onlyMine) {
        where.recipientId = user.id
      }
    } else {
      where[Op.or] = [
        { recipientId: user.id },
        { creatorId: user.id }
      ]
    }
    let scope = 'defaultScope'
    if (query.withJson) {
      scope = 'withJson'
    }
    const certificates = await Certificates.scope(scope).findAll({
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
          as: 'Creator'
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
    const { params, query, user } = req
    const { id } = params
    const where = { id }
    if (![
      userConstants.role.ADMIN,
      userConstants.role.MANAGER
    ].includes(user.role)) {
      where[Op.or] = [
        { recipientId: user.id },
        { creatorId: user.id }
      ]
    }
    let scope = 'defaultScope'
    if (query.full) {
      scope = 'full'
    }
    const certificate = await Certificates.scope(scope).findOne({ where })
    return res.status(200).json(certificate)
  } catch (e) {
    return res.status(500).json({ error: e.message })
  }
}

const getShared = async (req, res) => {
  try {
    const certificate = await Certificates.findOne({
      where: {
        sharingUuid: req.params.sharingUuid
      },
      attributes: [
        'status',
        'sharingUuid',
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

const reSendEmail = async (req, res) => {
  try {
    const { params, user } = req
    if (![
      userConstants.role.ADMIN,
      userConstants.role.MANAGER,
      userConstants.role.ISSUER
    ].includes(user.role)) {
      return res.status(403).json({ error: 'Unauthorized' })
    }
    const { id } = params
    const certificate = await Certificates.scope('full').findOne({ where: { id } })
    const email = certificate.json.recipient.identity.toLowerCase()
    const recipient = await Users.findOne({ where: { email } })
    if (recipient) {
      // Sign a token.
      const token = jsonwebtoken.sign({ id: recipient.id }, config.passport.secret, { expiresIn: '30 days' })
      // Notify recipient.
      const sendMailResult = await mailService.send(
        email,
        'certificate', {
          manageLink: `${config.client.url.loginFromToken}${token}`
        }, [
          {
            filename: `${certificate.json.badge.name}-${certificate.json.recipientProfile.name}.pdf`,
            content: Buffer.from(certificate.pdf, 'base64'),
            contentType: 'application/pdf'
          },
          {
            filename: `${certificate.json.badge.name}-${certificate.json.recipientProfile.name}.json`,
            content: JSON.stringify(certificate.json)
          }
        ]
      )
      return res.status(200).json({
        certificate,
        sendMailResult
      })
    }
  } catch (e) {
    console.log(e)
    return res.status(500).json({ error: e.message })
  }
}

const update = async (req, res) => {
  try {
    const { body, params, user } = req
    if (!inputService.validate(`${__dirname}/certificates.update.json`, req)) {
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
    const updated = await Certificates.scope('withJson').findOne({ where: { id } })
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
  reSendEmail,
  update
}
