const constants = require('../models/certificates/certificates.constants')

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable(
      'Certificates', {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER
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
        status: {
          type: Sequelize.INTEGER,
          allowNull: false,
          defaultValue: constants.status.NOT_SHARED
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
        uuid: {
          type: Sequelize.UUID,
          defaultValue: Sequelize.UUIDV4,
          allowNull: false
        },
        json: {
          type: Sequelize.JSON
        }
      }
    )
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Certificates')
  }
}
