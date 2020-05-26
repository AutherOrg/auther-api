const Sequelize = require('sequelize')

const db = require('../../services/database/database.service')
const constants = require('./issuers.constants')

const Issuers = db.define(
  'Issuers', {
    name: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true
    },
    email: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    url: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true
    },
    introductionUrl: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true
    },
    issuerProfileUrl: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true
    },
    revocationListUrl: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true
    },
    publicKey: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true
    },
    image: {
      type: Sequelize.TEXT('medium'),
      allowNull: false
    },
    status: {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: constants.status.ACTIVE
    }
  }, {
    defaultScope: {
      attributes: {
        exclude: [
          'id',
          'status',
          'createdAt',
          'updatedAt'
        ]
      }
    }
  }
)

module.exports = Issuers
