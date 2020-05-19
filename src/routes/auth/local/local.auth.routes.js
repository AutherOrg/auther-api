const router = require('express').Router()

const controller = require('../../../controllers/auth/local/local.auth.controller')

const routes = passport => {
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
   * @api {get} /auth/local Get authenticated user
   * @apiVersion 1.0.0
   * @apiName GetAuthLocal
   * @apiGroup Auth
   * @apiPermission recipient, admin, manager, issuer
   * @apiDescription Return the authenticated user.
   * @apiSuccess {Object} user (see GetUser)
   */
  router.get('/', passport.authenticate('jwt', { session: false }), controller.get)

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
  router.post('/password/set', passport.authenticate('jwt', { session: false }), controller.setPassword)

  /**
   * @api {post} /auth/local/password/reset Reset password
   * @apiVersion 1.0.0
   * @apiName PostAuthLocalPasswordReset
   * @apiGroup Auth
   * @apiPermission public
   * @apiDescription Send an email to set a new password.
   * @apiParam {string} email
   * @apiSuccess {Object} sendMailResult (see https://nodemailer.com/usage/#sending-mail)
   */
  router.post('/password/reset', controller.resetPassword)

  /**
   * @api {get} /auth/local/password/reset Process reset password link
   * @apiVersion 1.0.0
   * @apiName GetAuthLocalPasswordReset
   * @apiGroup Auth
   * @apiPermission recipient, admin, manager, issuer
   * @apiDescription Deactivate the user and empty his password.
   * @apiSuccess {Object} user (see GetUser)
   */
  router.get('/password/reset', passport.authenticate('jwt', { session: false }), controller.resetPasswordProcess)

  return router
}

module.exports = routes
