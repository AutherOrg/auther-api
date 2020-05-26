const constants = require('../models/issuers/issuers.constants')

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable(
      'Issuers', {
        id: {
          type: Sequelize.INTEGER,
          allowNull: false,
          autoIncrement: true,
          primaryKey: true
        },
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
        },
        createdAt: {
          type: Sequelize.DATE,
          allowNull: false
        },
        updatedAt: {
          type: Sequelize.DATE,
          allowNull: false
        }
      }
    )
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Issuers')
  }
}
