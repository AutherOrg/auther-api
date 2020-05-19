module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable(
      'ModelSignatures', {
        modelId: {
          type: Sequelize.INTEGER,
          references: {
            model: 'Models',
            key: 'id',
            as: 'modelId'
          },
          onDelete: 'cascade'
        },
        signatureId: {
          type: Sequelize.INTEGER,
          references: {
            model: 'Signatures',
            key: 'id',
            as: 'signatureId'
          },
          onDelete: 'cascade'
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
    return queryInterface.dropTable('ModelSignatures')
  }
}
