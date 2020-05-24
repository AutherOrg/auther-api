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
        revocationReason: {
          type: Sequelize.STRING,
          allowNull: false,
          defaultValue: 'Revoked by the issuer.'
        },
        certificateId: {
          type: Sequelize.INTEGER,
          references: {
            model: 'Certificates',
            key: 'id'
          },
          onDelete: 'SET NULL'
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
