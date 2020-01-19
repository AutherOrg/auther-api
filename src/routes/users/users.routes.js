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
   * @api {get} /users Get all users
   * @apiVersion 1.0.0
   * @apiName GetUsers
   * @apiGroup Users
   * @apiPermission admin
   * @apiDescription Return all users.
   * @apiSuccess {Object[]} data Array of users (see GetUser)
   */
  router.get('/', passport.authenticate('jwt', { session: false }), controller.getMany)

  /**
   * @api {get} /users/:id Get one user
   * @apiVersion 1.0.0
   * @apiName GetUser
   * @apiGroup Users
   * @apiPermission admin
   * @apiDescription Return one user.
   * @apiParam {Number} id User ID
   * @apiSuccess {Object} user User object
   * @apiSuccess {Number} user.id User ID
   * @apiSuccess {String} user.email
   * @apiSuccess {Number} user.status 1=active
   * @apiSuccess {Number} user.role 1=admin, 2=issuer, 3=recipient
   * @apiSuccess {String} user.createdAt
   * @apiSuccess {String} user.updatedAt
   */
  router.get('/:id', passport.authenticate('jwt', { session: false }), controller.getOne)

  return router
}

module.exports = routes
