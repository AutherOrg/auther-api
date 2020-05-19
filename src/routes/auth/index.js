const router = require('express').Router()

const localRoutes = require('./local/local.auth.routes')

const routes = passport => {
  router.use('/local', localRoutes(passport))

  return router
}

module.exports = routes
