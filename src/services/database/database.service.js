const Sequelize = require('sequelize')

const config = require('../../config')

const db = new Sequelize(
  config.db.database,
  config.db.user,
  config.db.password, {
    define: {
      charset: 'utf8',
      collate: 'utf8_general_ci'
    },
    host: config.db.host,
    dialect: 'mysql',
    pool: {
      max: 5,
      min: 0,
      idle: 10000
    }
  }
)

module.exports = db
