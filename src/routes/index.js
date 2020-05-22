const router = require('express').Router()

const authRoutes = require('./auth')
const usersRoutes = require('./users/users.routes')
const issuersRoutes = require('./issuers/issuers.routes')
const signaturesRoutes = require('./signatures/signatures.routes')
const modelsRoutes = require('./models/models.routes')
const certificatesRoutes = require('./certificates/certificates.routes')
const revocationsRoutes = require('./revocations/revocations.routes')
const blockcertsRoutes = require('./blockcerts/blockcerts.routes')

const routes = passport => {
  router.use('/auth', authRoutes(passport))
  router.use('/users', usersRoutes(passport))
  router.use('/issuer', issuersRoutes(passport))
  router.use('/signatures', signaturesRoutes(passport))
  router.use('/models', modelsRoutes(passport))
  router.use('/certificates', certificatesRoutes(passport))
  router.use('/revocations', revocationsRoutes(passport))
  router.use('/blockcerts', blockcertsRoutes(passport))
  return router
}

module.exports = routes
