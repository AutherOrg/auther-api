const router = require('express').Router()

const controller = require('../../controllers/issuers/issuers.controller')

const routes = passport => {
  /**
   * @api {get} /issuer Get issuer
   * @apiVersion 1.0.0
   * @apiName GetIssuer
   * @apiGroup Issuers
   * @apiPermission public
   * @apiSuccess {String} name
   * @apiSuccess {String} email
   * @apiSuccess {String} url Website URL
   * @apiSuccess {String} introductionUrl
   * @apiSuccess {String} issuerProfileUrl
   * @apiSuccess {String} revocationListUrl
   * @apiSuccess {String} publicKey Public Ethereum address
   * @apiSuccess {String} image Logo in base64
   */
  router.get('/', controller.getOne)

  /**
   * @api {patch} /issuer Update issuer
   * @apiVersion 1.0.0
   * @apiName PatchIssuer
   * @apiGroup Issuers
   * @apiPermission admin
   * @apiParam {String} [name]
   * @apiParam {String} [email]
   * @apiParam {String} [url] Website URL
   * @apiParam {String} [introductionUrl]
   * @apiParam {String} [issuerProfileUrl]
   * @apiParam {String} [revocationListUrl]
   * @apiParam {String} [publicKey] Public Ethereum address
   * @apiParam {String} [image] Logo in base64
   * @apiSuccess {Object} data Updated issuer
   */
  router.patch('/', passport.authenticate('jwt', { session: false }), controller.update)

  return router
}

module.exports = routes
