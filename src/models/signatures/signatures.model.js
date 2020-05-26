const Sequelize = require('sequelize')

const db = require('../../services/database/database.service')
const constants = require('./signatures.constants')
const Users = require('../users/users.model')
const Models = require('../models/models.model')

const Signatures = db.define(
  'Signatures', {
    name: {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: ''
    },
    jobTitle: {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: ''
    },
    status: {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: constants.status.ACTIVE
    },
    image: {
      type: Sequelize.TEXT('medium'),
      allowNull: false
    }
  }
)

Signatures.belongsTo(Users, {
  foreignKey: 'creatorId',
  as: 'Creator'
})

Signatures.belongsToMany(Models, {
  through: 'ModelSignatures',
  foreignKey: 'signatureId'
})

Models.belongsToMany(Signatures, {
  through: 'ModelSignatures',
  foreignKey: 'modelId'
})

module.exports = Signatures
