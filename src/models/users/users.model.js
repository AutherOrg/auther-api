const Sequelize = require('sequelize')

const db = require('../../services/database/database.service')
const constants = require('./users.constants')

module.exports = db.define(
  'Users', {
    email: {
      type: Sequelize.STRING,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    role: {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: constants.role.RECIPIENT
    },
    status: {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: constants.status.INACTIVE
    },
    passwordHash: {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: ''
    }
  }, {
    defaultScope: {
      attributes: { exclude: ['passwordHash'] }
    },
    scopes: {
      withPasswordHash: {
        attributes: {}
      }
    }
  })
