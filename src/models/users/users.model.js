const db = require('../../services/database/database.service')
const table = require('./users.table')

module.exports = db.define('Users', table, {
  defaultScope: {
    attributes: { exclude: ['passwordHash'] }
  },
  scopes: {
    withPasswordHash: {
      attributes: {}
    }
  }
})
