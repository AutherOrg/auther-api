const constants = require('../models/certificates/certificates.constants')

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable(
      'Certificates', {
        id: {
          type: Sequelize.INTEGER,
          allowNull: false,
          autoIncrement: true,
          primaryKey: true
        },
        name: {
          type: Sequelize.STRING,
          allowNull: false
        },
        status: {
          type: Sequelize.INTEGER,
          allowNull: false,
          defaultValue: constants.status.SHARED
        },
        recipientId: {
          type: Sequelize.INTEGER,
          references: {
            model: 'Users',
            key: 'id'
          }
        },
        creatorId: {
          type: Sequelize.INTEGER,
          references: {
            model: 'Users',
            key: 'id'
          }
        },
        createdAt: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: new Date()
        },
        updatedAt: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: new Date()
        },
        blockcertsUuid: {
          type: Sequelize.STRING,
          allowNull: false
        },
        sharingUuid: {
          type: Sequelize.UUID,
          allowNull: false,
          defaultValue: Sequelize.UUIDV4
        },
        json: {
          type: Sequelize.JSON
        },
        pdf: {
          type: Sequelize.TEXT('medium')
        }
      }
    )
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Certificates')
  }
}
