const router = require('express').Router()

const authRoutes = require('./auth')
const usersRoutes = require('./users/users.routes')
const certificatesRoutes = require('./certificates/certificates.routes')

const routes = passport => {
  router.use('/auth', authRoutes(passport))

  router.use('/users', usersRoutes(passport))

  router.use('/certificates', certificatesRoutes(passport))

  return router
}

module.exports = routes
