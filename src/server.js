const express = require('express')
const morgan = require('morgan')
const passport = require('passport')
const bodyParser = require('body-parser')

const config = require('./config')
const hookJwtStrategy = require('./services/passport/jwtStrategy.service')
const routes = require('./routes')

const app = express()

app.enable('trust proxy')

morgan.token('user-id', function (req, res) {
  return req.user ? req.user.id : '-'
})
app.use(morgan(':remote-addr :user-id :method :url HTTP/:http-version :status :response-time'))

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization')
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PATCH, PUT, DELETE')
  next()
})

app.use(bodyParser.json({
  limit: '5mb'
}))
app.use(bodyParser.urlencoded({
  extended: false
}))

app.use(passport.initialize())
hookJwtStrategy(passport)

app.get('/', (req, res) => {
  res.send('OpenBlockcerts API documentation: https://openblockcerts.github.io/openblockcerts-api')
})

app.use(routes(passport))

app.listen(config.server.port, () => {
  console.log('Server is running on port', config.server.port)
})
