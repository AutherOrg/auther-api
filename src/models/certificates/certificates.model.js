const db = require('../../services/database/database.service')
const usersModel = require('../users/users.model')
const table = require('./certificates.table')

const certificatesModel = db.define('certificates', table)

certificatesModel.belongsTo(usersModel, {
  foreignKey: 'user_id',
  as: 'user'
})

module.exports = certificatesModel
