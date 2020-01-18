const router = require('express').Router()

const controller = require('../../../controllers/auth/local/localAuth.controller')

const routes = () => {
  /**
   * @api {post} /auth/local Authenticate
   * @apiVersion 1.0.0
   * @apiName PostAuthLocal
   * @apiGroup Auth
   * @apiPermission public
   * @apiDescription
   *
   * Returns a JWT for the user.
   *
   * This JWT will have to be included as Authorization: Bearer XYZ in the headers of all later RESTful requests.
   *
   * @apiParam {Object} user
   * @apiParam {String} user.email
   * @apiParam {String} user.password
   * @apiSuccess {Object} data
   * @apiSuccess {String} data.bearerToken Json web token
   */
  router.post('/', controller.authenticate)

  return router
}

module.exports = routes
