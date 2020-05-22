module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable(
      'Revocations', {
        id: {
          type: Sequelize.INTEGER,
          allowNull: false,
          autoIncrement: true,
          primaryKey: true
        },
        certificateId: {
          type: Sequelize.INTEGER,
          references: {
            model: 'Certificates',
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
          allowNull: false
        },
        updatedAt: {
          type: Sequelize.DATE,
          allowNull: false
        },
        blockcertsUuid: {
          type: Sequelize.STRING,
          allowNull: false
        }
      }
    )
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Revocations')
  }
}
