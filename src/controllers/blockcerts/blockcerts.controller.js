const Issuers = require('../../models/issuers/issuers.model')
const Revocations = require('../../models/revocations/revocations.model')

const getIssuerProfile = async (req, res) => {
  try {
    const id = 1
    const data = await Issuers.findOne({ where: { id } })
    res.status(200).json({
      '@context': [
        'https://w3id.org/openbadges/v2',
        'https://w3id.org/blockcerts/v2'
      ],
      type: 'Profile',
      id: data.issuerProfileUrl,
      name: data.name,
      email: data.email,
      url: data.url,
      introductionURL: data.introductionUrl,
      publicKey: [
        {
          id: data.publicKey,
          created: '2019-10-25T10:51:53.490752+00:00'
        }
      ],
      revocationList: data.revocationListUrl,
      image: data.image
    })
  } catch (e) {
    return res.status(500).json({ error: e.message })
  }
}

const getRevocationList = async (req, res) => {
  try {
    const id = 1
    const issuer = await Issuers.findOne({ where: { id } })
    const data = await Revocations.findAll()
    const revocations = data.map(revocation => {
      return {
        id: revocation.blockcertsUuid,
        revocationReason: revocation.revocationReason
      }
    })
    res.status(200).json({
      '@context': 'https://w3id.org/openbadges/v2',
      id: issuer.revocationListUrl,
      type: 'RevocationList',
      issuer: issuer.issuerProfileUrl,
      revokedAssertions: revocations
    })
  } catch (e) {
    return res.status(500).json({ error: e.message })
  }
}

const controller = {
  getIssuerProfile,
  getRevocationList
}

module.exports = controller
