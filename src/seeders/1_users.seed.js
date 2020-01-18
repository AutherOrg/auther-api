const constants = require('../models/users/users.constants')
const passwordService = require('../services/password/password.service')

const collection = 'users'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return insert(queryInterface, Sequelize)
  },
  down: (queryInterface) => {
    return queryInterface.bulkDelete(collection, null, {})
  }
}

async function insert (queryInterface) {
  const data = []

  const admin = {
    email: 'admin@example.com',
    status: constants.statuses.ACTIVE,
    role: constants.roles.ADMIN,
    passwordHash: await passwordService.hash('wxc123'),
    createdAt: new Date(),
    updatedAt: new Date()
  }

  data.push(admin)

  return queryInterface.bulkInsert(collection, data)
}
