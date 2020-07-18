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
  router.get('/', passport.authenticate('jwt', { session: false }), controller.getAll)

  /**
   * @api {get} /certificates/:id Get a certificate.
   * @apiVersion 1.0.0
   * @apiName GetCertificate
   * @apiGroup Certificates
   * @apiPermission admin, issuer, recipient
   * @apiDescription Get a certificate by its ID.
   * @apiSuccess {Object} certificate Certificate (see https://github.com/blockchain-certificates/cert-schema)
   */
  router.get('/:id', passport.authenticate('jwt', { session: false }), controller.getOne)

  /**
   * @api {patch} /certificates/:id Update a certificate.
   * @apiVersion 1.0.0
   * @apiName PatchCertificate
   * @apiGroup Certificates
   * @apiPermission recipient
   * @apiDescription Update a certificate.
   * @apiSuccess {Object} certificate Certificate (see https://github.com/blockchain-certificates/cert-schema)
   */
  router.patch('/:id', passport.authenticate('jwt', { session: false }), controller.update)

  /**
   * @api {delete} /certificates/:id Delete a certificate.
   * @apiVersion 1.0.0
   * @apiName DeleteCertificate
   * @apiGroup Certificates
   * @apiPermission recipient
   * @apiDescription Delete a certificate.
   * @apiSuccess {Number} rows
   */
  router.delete('/:id', passport.authenticate('jwt', { session: false }), controller.destroy)

  /**
   * @api {get} /certificates/shared/:sharingUuid Get a shared certificate.
   * @apiVersion 1.0.0
   * @apiName GetCertificate
   * @apiGroup Certificates
   * @apiPermission public
   * @apiDescription Get a certificate by its sharing UUID and only if it is shared.
   * @apiSuccess {Object} certificate Certificate (see https://github.com/blockchain-certificates/cert-schema)
   */
  router.get('/shared/:sharingUuid', controller.getShared)

  /**
   * @api {get} /certificates/resendemail:id Resend a certificate email.
   * @apiVersion 1.0.0
   * @apiName GetCertificateResendEmail
   * @apiGroup Certificates
   * @apiPermission admin, manager, issuer
   * @apiDescription Resend a certificate email.
   * @apiSuccess {Number} rows
   */
  router.get('/:id/resendemail', passport.authenticate('jwt', { session: false }), controller.reSendEmail)

  return router
}

module.exports = routes
