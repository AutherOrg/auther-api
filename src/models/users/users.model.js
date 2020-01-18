const Sequelize = require('sequelize')

const db = require('../../services/database/database.service')
const userConstants = require('./users.constants')

const usersModel = db.define('users', {
  email: {
    type: Sequelize.STRING,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  status: {
    type: Sequelize.INTEGER,
    allowNull: false,
    defaultValue: userConstants.statuses.ACTIVE
  },
  role: {
    type: Sequelize.INTEGER,
    allowNull: false,
    defaultValue: userConstants.roles.RECIPIENT
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

module.exports = usersModel
