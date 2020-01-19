const table = require('../models/certificates/certificates.table')

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Certificates', table)
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Certificates')
  }
}
