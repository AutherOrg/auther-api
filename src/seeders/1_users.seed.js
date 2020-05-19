const config = require('../config')
const constants = require('../models/users/users.constants')
const passwordService = require('../services/password/password.service')

const collection = 'Users'

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
    email: config.admin.email,
    status: constants.status.ACTIVE,
    role: constants.role.ADMIN,
    passwordHash: await passwordService.hash(config.admin.password),
    createdAt: new Date(),
    updatedAt: new Date()
  }

  data.push(admin)

  return queryInterface.bulkInsert(collection, data)
}
