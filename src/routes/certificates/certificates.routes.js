const router = require('express').Router()

const controller = require('../../controllers/certificates/certificates.controller')

const routes = passport => {
  router.post('/', passport.authenticate('jwt', { session: false }), controller.create)

  router.get('/', passport.authenticate('jwt', { session: false }), controller.getMany)

  router.get('/:uuid', controller.getOne)

  return router
}

module.exports = routes
