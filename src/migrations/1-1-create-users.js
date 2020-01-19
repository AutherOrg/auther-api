const table = require('../models/users/users.table')

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Users', table)
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Users')
  }
}
