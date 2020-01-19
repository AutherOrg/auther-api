const db = require('../../services/database/database.service')
const usersModel = require('../users/users.model')
const table = require('./certificates.table')

const certificatesModel = db.define('Certificates', table)

certificatesModel.belongsTo(usersModel, {
  foreignKey: 'recipientId',
  as: 'Recipient'
})

certificatesModel.belongsTo(usersModel, {
  foreignKey: 'issuerId',
  as: 'Issuer'
})

module.exports = certificatesModel
