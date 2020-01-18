const Sequelize = require('sequelize')
const constants = require('./users.constants')

module.exports = {
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
    defaultValue: constants.statuses.ACTIVE
  },
  role: {
    type: Sequelize.INTEGER,
    allowNull: false,
    defaultValue: constants.roles.RECIPIENT
  },
  passwordHash: {
    type: Sequelize.STRING,
    allowNull: false,
    defaultValue: ''
  },
  createdAt: {
    type: Sequelize.DATE
  },
  updatedAt: {
    type: Sequelize.DATE
  }
}
