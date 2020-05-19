const router = require('express').Router()

const controller = require('../../controllers/signatures/signatures.controller')

const routes = passport => {
  /**
   * @api {post} /signatures Create a signature
   * @apiVersion 1.0.0
   * @apiName PostSignature
   * @apiGroup Signatures
   * @apiPermission admin, manager, issuer
   * @apiParam {String} name Full name of the person
   * @apiParam {String} jobTitle Job title or position of the person
   * @apiParam {String} image Signature of the person in base64
   * @apiSuccess {Object} data Created signature (see GetSignature)
   */
  router.post('/', passport.authenticate('jwt', { session: false }), controller.create)

  /**
   * @api {delete} /signatures/:id Delete a signature
   * @apiVersion 1.0.0
   * @apiName DeleteSignature
   * @apiGroup Signatures
   * @apiPermission admin, manager, issuer
   * @apiSuccess {Number} rows
   */
  router.delete('/:id', passport.authenticate('jwt', { session: false }), controller.destroy)

  /**
   * @api {get} /signatures Get all signatures
   * @apiVersion 1.0.0
   * @apiName GetSignatures
   * @apiGroup Signatures
   * @apiPermission admin, manager, issuer
   * @apiSuccess {Object[]} data Array of signatures (see GetSignature)
   */
  router.get('/', passport.authenticate('jwt', { session: false }), controller.getMany)

  /**
   * @api {get} /signatures/:id Get one signature
   * @apiVersion 1.0.0
   * @apiName GetSignature
   * @apiGroup Signatures
   * @apiPermission admin, manager, issuer
   * @apiParam {Number} id
   * @apiSuccess {Number} id
   * @apiSuccess {Number} status 1=active
   * @apiSuccess {String} name Full name of the person
   * @apiSuccess {String} jobTitle Job title or position of the person
   * @apiSuccess {String} createdAt
   * @apiSuccess {String} updatedAt
   * @apiSuccess {String} image Signature of the person in base64
   */
  router.get('/:id', passport.authenticate('jwt', { session: false }), controller.getOne)

  return router
}

module.exports = routes
