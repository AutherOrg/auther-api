const Sequelize = require('sequelize')

const db = require('../../services/database/database.service')
const constants = require('./models.constants')
const Users = require('../users/users.model')

const Models = db.define(
  'Models', {
    name: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true
    },
    description: {
      type: Sequelize.TEXT,
      allowNull: false,
      defaultValue: ''
    },
    template: {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: 'Default'
    },
    status: {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: constants.status.ACTIVE
    },
    image: {
      type: Sequelize.TEXT('medium'),
      allowNull: false,
      defaultValue: ''
    }
  }
)

Models.belongsTo(Users, {
  foreignKey: 'creatorId',
  as: 'Creator'
})

module.exports = Models
