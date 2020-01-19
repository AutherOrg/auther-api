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
   * @apiSuccess {Object} user (see GetUser)
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
   * @apiSuccess {Object} user (see GetUser)
   * @apiSuccess {String} token Json web token
   */
  router.post('/permanent', controller.authenticateFromPermanentToken)

  /**
   * @api {post} /auth/local/password/set Set password
   * @apiVersion 1.0.0
   * @apiName PostAuthLocalPasswordSet
   * @apiGroup Auth
   * @apiPermission public
   * @apiDescription Set password. The password will be set only after verification of the email.
   * @apiParam {string} email
   * @apiParam {String} password
   * @apiSuccess {String} passwordToken The token to set the password
   * @apiSuccess {Object} sendMailResult (see https://nodemailer.com/usage/#sending-mail)
   */
  router.post('/password/set', controller.setPassword)

  /**
   * @api {post} /auth/local/password/validate Validate password change
   * @apiVersion 1.0.0
   * @apiName PostAuthLocalPasswordValidate
   * @apiGroup Auth
   * @apiPermission public
   * @apiDescription Validate password.
   * @apiParam {String} passwordToken The token sent by email to set the password.
   * @apiSuccess {Object} user (see GetUser)
   * @apiSuccess {String} token Json web token
   */
  router.post('/password/validate', controller.validatePassword)

  return router
}

module.exports = routes
