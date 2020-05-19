const Sequelize = require('sequelize')

const db = require('../../services/database/database.service')
const constants = require('./certificates.constants')
const Users = require('../users/users.model')

const Certificates = db.define(
  'Certificates', {
    status: {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: constants.status.NOT_SHARED
    },
    uuid: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      allowNull: false
    },
    json: {
      type: Sequelize.JSON,
      get (field) {
        return typeof this.getDataValue(field) === 'string' ? JSON.parse(this.getDataValue(field)) : this.getDataValue(field)
      }
    }
  }
)

Certificates.belongsTo(Users, {
  foreignKey: 'recipientId',
  as: 'Recipient'
})

Certificates.belongsTo(Users, {
  foreignKey: 'creatorId',
  as: 'Creator'
})

module.exports = Certificates
