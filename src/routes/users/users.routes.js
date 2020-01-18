const router = require('express').Router()

const controller = require('../../controllers/users/users.controller')

const routes = passport => {
  /**
   * @api {post} /users Create a user
   * @apiVersion 1.0.0
   * @apiName PostUser
   * @apiGroup Users
   * @apiPermission admin
   * @apiDescription Creates a user
   * @apiParam {Object} user
   * @apiParam {String} user.email
   * @apiParam {String} user.password
   * @apiParam {String} [user.role] 1=admin, 2=issuer, 3=recipient (default)
   * @apiSuccess {Object} data Created user (see GetUser)
   */
  router.post('/', passport.authenticate('jwt', { session: false }), controller.create)

  /**
   * @api {get} /users Get users
   * @apiVersion 1.0.0
   * @apiName GetUsers
   * @apiGroup Users
   * @apiPermission recipient, issuer, admin
   * @apiDescription
   *
   * For recipient and issuer roles, only get the active user himself.
   *
   * For admin, return all users.
   *
   * @apiSuccess {Object[]} data Array of users (see GetUser)
   */
  router.get('/', passport.authenticate('jwt', { session: false }), controller.getMany)

  /**
   * @api {get} /users/:id Get user
   * @apiVersion 1.0.0
   * @apiName GetUser
   * @apiGroup Users
   * @apiPermission admin
   * @apiDescription Return any user.
   * @apiParam {Number} id User ID
   * @apiSuccess {Object} data User object
   * @apiSuccess {Number} data.id User ID
   * @apiSuccess {String} data.email
   * @apiSuccess {Number} data.status 1=active
   * @apiSuccess {Number} data.role 1=admin, 2=issuer, 3=recipient
   */
  router.get('/:id', passport.authenticate('jwt', { session: false }), controller.getOne)

  /**
   * @api {post} /users/register Send an email with a register link
   * @apiVersion 1.0.0
   * @apiName PostUserRegister
   * @apiGroup Users
   * @apiPermission public
   * @apiDescription Send an email with a register link.
   * @apiParam {Object} user
   * @apiParam {String} user.email User email
   * @apiSuccess {Object} data
   * @apiSuccess {String} data.sendMailResult
   */
  router.post('/register', controller.register)

  /**
   * @api {post} /users/validate Validate an email and create a user
   * @apiVersion 1.0.0
   * @apiName PostUserValidate
   * @apiGroup Users
   * @apiPermission public
   * @apiDescription Validate an email and create a user.
   * @apiParam {Object} user
   * @apiParam {String} user.password
   * @apiParam {String} registrationToken
   * @apiSuccess {Object} data
   * @apiSuccess {String} data.user User object (see GetUser)
   */
  router.post('/validate', controller.validate)

  return router
}

module.exports = routes
