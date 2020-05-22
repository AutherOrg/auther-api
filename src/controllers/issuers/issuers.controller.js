const Issuers = require('../../models/issuers/issuers.model')
const usersConstants = require('../../models/users/users.constants')
const inputService = require('../../services/input/input.service')

const getOne = async (req, res) => {
  try {
    const { user } = req
    if (![
      usersConstants.role.ADMIN,
      usersConstants.role.MANAGER,
      usersConstants.role.ISSUER
    ].includes(user.role)) {
      return res.status(403).json({ error: 'Unauthorized' })
    }
    const id = 1
    const data = await Issuers.findOne({ where: { id } })
    res.status(200).json(data)
  } catch (e) {
    return res.status(500).json({ error: e.message })
  }
}

const update = async (req, res) => {
  try {
    const { body, user } = req
    const id = 1
    if (![
      usersConstants.role.ADMIN
    ].includes(user.role)) {
      return res.status(403).json({ error: 'Unauthorized' })
    }
    if (!inputService.validate(`${__dirname}/issuers.update.json`, req)) {
      return res.status(400).json({ error: 'Bad request' })
    }
    const { name, email, url, introductionUrl, issuerProfileUrl, revocationListUrl, publicKey, image } = body
    const data = {}
    if (name !== '') {
      data.name = name
    }
    if (email !== '') {
      data.email = email
    }
    if (url !== '') {
      data.url = url
    }
    if (introductionUrl !== '') {
      data.introductionUrl = introductionUrl
    }
    if (issuerProfileUrl !== '') {
      data.issuerProfileUrl = issuerProfileUrl
    }
    if (revocationListUrl !== '') {
      data.revocationListUrl = revocationListUrl
    }
    if (publicKey !== '') {
      data.publicKey = publicKey
    }
    if (image !== '') {
      data.image = image
    }
    await Issuers.update(data, {
      where: { id }
    })
    const updated = await Issuers.findOne({
      where: { id }
    })
    return res.status(200).json(updated)
  } catch (e) {
    return res.status(500).json({ error: e.message })
  }
}

const controller = {
  getOne,
  update
}

module.exports = controller
