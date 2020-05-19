const collection = 'ModelSignatures'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return insert(queryInterface, Sequelize)
  },
  down: (queryInterface) => {
    return queryInterface.bulkDelete(collection, null, {})
  }
}

async function insert (queryInterface) {
  const data = [
    {
      modelId: 1,
      signatureId: 1,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ]
  return queryInterface.bulkInsert(collection, data)
}
