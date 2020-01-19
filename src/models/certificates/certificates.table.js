const Sequelize = require('sequelize')
const constants = require('./certificates.constants')

module.exports = {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: Sequelize.INTEGER
  },
  status: {
    type: Sequelize.INTEGER,
    allowNull: false,
    defaultValue: constants.status.SHARED
  },
  uuid: {
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV4,
    allowNull: false
  },
  json: {
    type: Sequelize.JSON,
    get (field) {
      return typeof this.getDataValue(field) === 'string' ? JSON.parse(this.getDataValue(field)) : this.getDataValue(field)
    }
  },
  createdAt: {
    type: Sequelize.DATE
  },
  updatedAt: {
    type: Sequelize.DATE
  }
}
