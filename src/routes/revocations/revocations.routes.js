const router = require('express').Router()

const controller = require('../../controllers/revocations/revocations.controller')

const routes = passport => {
  /**
   * @api {post} /revocations Create a revocation
   * @apiVersion 1.0.0
   * @apiName PostRevocation
   * @apiGroup Revocations
   * @apiPermission admin, manager, issuer
   * @apiParam {Number} certificateId
   * @apiParam {String} uuid certificate.json.id
   * @apiSuccess {Object} data Created revocation (see GetRevocation)
   */
  router.post('/', passport.authenticate('jwt', { session: false }), controller.create)

  /**
   * @api {delete} /revocations/:id Delete a revocation
   * @apiVersion 1.0.0
   * @apiName DeleteRevocation
   * @apiGroup Revocations
   * @apiPermission admin, manager, issuer
   * @apiSuccess {Number} rows
   */
  router.delete('/:id', passport.authenticate('jwt', { session: false }), controller.destroy)

  /**
   * @api {get} /revocations Get all revocations
   * @apiVersion 1.0.0
   * @apiName GetRevocations
   * @apiGroup Revocations
   * @apiPermission admin, manager, issuer
   * @apiSuccess {Object[]} data Array of revocations (see GetRevocation)
   */
  router.get('/', passport.authenticate('jwt', { session: false }), controller.getMany)

  return router
}

module.exports = routes
