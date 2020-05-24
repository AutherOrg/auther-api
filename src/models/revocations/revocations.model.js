const Sequelize = require('sequelize')

const db = require('../../services/database/database.service')
const Certificates = require('../certificates/certificates.model')
const Users = require('../users/users.model')

const Revocations = db.define(
  'Revocations', {
    revocationReason: {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: 'Revoked by the issuer.'
    },
    blockcertsUuid: {
      type: Sequelize.STRING,
      allowNull: false
    }
  }
)

Revocations.belongsTo(Certificates, {
  foreignKey: 'certificateId',
  as: 'Certificate'
})

Revocations.belongsTo(Users, {
  foreignKey: 'creatorId',
  as: 'Creator'
})

module.exports = Revocations
