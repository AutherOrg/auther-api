const router = require('express').Router()

const controller = require('../../controllers/models/models.controller')

const routes = passport => {
  /**
   * @api {post} /models Create a model
   * @apiVersion 1.0.0
   * @apiName PostModel
   * @apiGroup Models
   * @apiPermission admin, manager, issuer
   * @apiParam {String} name Badge name
   * @apiParam {String} description Badge description
   * @apiParam {String} template Template name
   * @apiParam {String} image Badge image in base64
   * @apiParam {Number[]} signatures Array of signatures IDs (see GetSignatures)
   * @apiSuccess {Object} data Created model (see GetModel)
   */
  router.post('/', passport.authenticate('jwt', { session: false }), controller.create)

  /**
   * @api {delete} /models/:id Delete a model
   * @apiVersion 1.0.0
   * @apiName DeleteModel
   * @apiGroup Models
   * @apiPermission admin, manager, issuer
   * @apiSuccess {Number} rows
   */
  router.delete('/:id', passport.authenticate('jwt', { session: false }), controller.destroy)

  /**
   * @api {get} /models Get all models
   * @apiVersion 1.0.0
   * @apiName GetModels
   * @apiGroup Models
   * @apiPermission admin, manager, issuer
   * @apiParam {bool} [withSignatures] Include signatures if true (see GetSignature)
   * @apiSuccess {Object[]} data Array of models (see GetModel)
   */
  router.get('/', passport.authenticate('jwt', { session: false }), controller.getMany)

  /**
   * @api {get} /models/:id Get one model
   * @apiVersion 1.0.0
   * @apiName GetModel
   * @apiGroup Models
   * @apiPermission admin, manager, issuer
   * @apiParam {Number} id Model ID
   * @apiParam {bool} [withSignatures] Include signatures if true (see GetSignature)
   * @apiSuccess {Number} id
   * @apiSuccess {Number} status 1=active
   * @apiSuccess {String} name
   * @apiSuccess {String} description
   * @apiSuccess {String} template
   * @apiSuccess {String} createdAt
   * @apiSuccess {String} updatedAt
   * @apiSuccess {String} image
   */
  router.get('/:id', passport.authenticate('jwt', { session: false }), controller.getOne)

  /**
   * @api {patch} /models/:id Update a model
   * @apiVersion 1.0.0
   * @apiName PatchModel
   * @apiGroup Models
   * @apiPermission admin, manager, issuer
   * @apiParam {Object} data Properties to update (see PostModel)
   * @apiSuccess {Object} data Model (see GetModel)
   */
  router.patch('/:id', passport.authenticate('jwt', { session: false }), controller.update)

  return router
}

module.exports = routes
