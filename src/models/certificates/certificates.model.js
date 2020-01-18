const Sequelize = require('sequelize')

const db = require('../../services/database/database.service')
const usersModel = require('../users/users.model')
const certificatesConstants = require('./certificates.constants')

const certificatesModel = db.define('certificates', {
  status: {
    type: Sequelize.INTEGER,
    allowNull: false,
    defaultValue: certificatesConstants.statuses.SHARED
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
}, {
  underscored: true
})

certificatesModel.belongsTo(usersModel, {
  foreignKey: 'user_id',
  as: 'user'
})

module.exports = certificatesModel
