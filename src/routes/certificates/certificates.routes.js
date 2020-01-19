const router = require('express').Router()

const controller = require('../../controllers/certificates/certificates.controller')

const routes = passport => {
  /**
   * @api {post} /certificates/createWithRecipient Create a certificate and a recipient if necessary
   * @apiVersion 1.0.0
   * @apiName PostCertificatesCreateWithRecipient
   * @apiGroup Certificates
   * @apiPermission admin, issuer
   * @apiDescription Create a certificate and associate it with a recipient: either an already one with the same email, or create a new recipient on the fly.
   * @apiParam {Object} certificate
   * @apiSuccess {Object} certificate Created certificate (see GetCertificate)
   * @apiSuccess {Object} sendMailResult (see https://nodemailer.com/usage/#sending-mail)
   */
  router.post('/', passport.authenticate('jwt', { session: false }), controller.createWithRecipient)

  /**
   * @api {get} /certificates Get all certificates
   * @apiVersion 1.0.0
   * @apiName GetCertificates
   * @apiGroup Certificates
   * @apiPermission admin, issuer, recipient
   * @apiDescription Get all certificiates. For admin: all. For issuer: all the issued certificates. For recipient: all her/his certificates.
   * @apiSuccess {Object[]} certificates Array of certificates (see GetCertificate)
   */
  router.get('/', passport.authenticate('jwt', { session: false }), controller.getMany)

  /**
   * @api {get} /certificates/:uuid Get a shared certificate.
   * @apiVersion 1.0.0
   * @apiName GetCertificate
   * @apiGroup Certificates
   * @apiPermission public
   * @apiDescription Get a certificate by its UUID and only if it is shared.
   * @apiSuccess {Object} certificate Certificate (see https://github.com/blockchain-certificates/cert-schema)
   */
  router.get('/:uuid', controller.getOne)

  return router
}

module.exports = routes
