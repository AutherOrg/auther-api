const config = require('./src/config')

module.exports = {
  development: {
    username: config.db.user,
    password: config.db.password,
    database: config.db.database,
    host: config.db.host,
    dialect: 'mysql'
  }
}
