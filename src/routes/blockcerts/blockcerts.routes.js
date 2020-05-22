const router = require('express').Router()

const controller = require('../../controllers/blockcerts/blockcerts.controller')

const routes = () => {
  /**
   * @api {get} /blockcerts/issuer Get issuer profile
   * @apiVersion 1.0.0
   * @apiName GetBlockcertsIssuer
   * @apiGroup Blockcerts
   * @apiPermission public
   * @apiSuccess {Object} Issuer profile in the Blockcerts v2 standard
   */
  router.get('/issuer', controller.getIssuerProfile)

  /**
   * @api {get} /blockcerts/revocations Get revocation list
   * @apiVersion 1.0.0
   * @apiName GetBlockcertsRevocations
   * @apiGroup Blockcerts
   * @apiPermission public
   * @apiSuccess {Object} Revocation list in the Blockcerts v2 standard
   */
  router.get('/revocations', controller.getRevocationList)

  return router
}

module.exports = routes
