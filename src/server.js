const express = require('express')
const passport = require('passport')
const bodyParser = require('body-parser')

const config = require('./config')
const db = require('./services/database/database.service')
const hookJwtStrategy = require('./services/passport/jwtStrategy.service')
const routes = require('./routes')

// (Re)create DB tables if necessary.
if (Number(config.db.sync) === 1) {
  db.sync({ force: true })
}

const app = express()

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization')
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE')
  next()
})

app.use(bodyParser.json({
  limit: '1mb'
}))
app.use(bodyParser.urlencoded({
  extended: false
}))

app.use(passport.initialize())

// Hook Passport strategies.
hookJwtStrategy(passport)

app.get('/', (req, res) => {
  res.send('Blockcerts API documentation: https://github.com/guix77/blockcerts-api')
})

app.use(routes(passport))

app.listen(config.server.port, () => {
  console.log('Server is running on port', config.server.port)
})
