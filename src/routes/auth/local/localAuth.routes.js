const router = require('express').Router()

const controller = require('../../../controllers/auth/local/localAuth.controller')

const routes = () => {
  /**
   * @api {post} /auth/local Authenticate
   * @apiVersion 1.0.0
   * @apiName PostAuthLocal
   * @apiGroup Auth
   * @apiPermission public
   * @apiDescription Post email and password and return a JWT and the user.
   * @apiParam {Object} user object
   * @apiParam {String} user.email
   * @apiParam {String} user.password
   * @apiSuccess {Object} user
   * @apiSuccess {String} user.email
   * @apiSuccess {String} user.password
   * @apiSuccess {String} token Json web token
   */
  router.post('/', controller.authenticate)

  /**
   * @api {post} /auth/local/permanent Authenticate from permanent token
   * @apiVersion 1.0.0
   * @apiName PostAuthLocalPermanent
   * @apiGroup Auth
   * @apiPermission public
   * @apiDescription Post a permanent token and return a JWT and the user.
   * @apiParam {String} permanentToken
   * @apiSuccess {Object} user
   * @apiSuccess {String} user.email
   * @apiSuccess {String} user.password
   * @apiSuccess {String} token Json web token
   */
  router.post('/permanent', controller.authenticateFromPermanentToken)

  return router
}

module.exports = routes
