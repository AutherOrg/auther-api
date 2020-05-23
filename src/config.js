require('dotenv').config()

module.exports = {
  server: {
    protocol: process.env.SERVER_PROTOCOL,
    host: process.env.SERVER_HOST,
    port: process.env.SERVER_PORT
  },
  db: {
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    sync: process.env.DB_SYNC
  },
  passport: {
    secret: process.env.PASSPORT_SECRET
  },
  nodemailer: {
    transport: process.env.NODEMAILER_TRANSPORT,
    from: process.env.NODEMAILER_FROM,
    smtp: {
      host: process.env.NODEMAILER_SMTP_HOST,
      port: process.env.NODEMAILER_SMTP_PORT,
      auth: {
        user: process.env.NODEMAILER_SMTP_USER,
        pass: process.env.NODEMAILER_SMTP_PASS
      }
    }
  },
  admin: {
    email: process.env.ADMIN_EMAIL,
    password: process.env.ADMIN_PASSWORD
  },
  issuer: {
    issuerProfileUrl: process.env.ISSUER_PROFILE_URL,
    publicKey: process.env.ISSUER_PUBLIC_KEY
  },
  loginFromTokenUrl: process.env.LOGIN_FROM_TOKEN_URL,
  resetPasswordProcessUrl: process.env.RESET_PASSWORD_PROCESS_URL,
  shareUrl: process.env.SHARE_URL,
  applicationName: process.env.APPLICATION_NAME,
  validateCertificates: process.env.VALIDATE_CERTIFICATES === 'true',
  pdf: {
    style: {
      wrapper: process.env.PDF_STYLE_WRAPPER,
      verification: {
        wrapper: process.env.PDF_STYLE_VERIFICATION_WRAPPER,
        text: process.env.PDF_STYLE_VERIFICATION_TEXT,
        link: process.env.PDF_STYLE_VERIFICATION_LINK
      }
    }
  }
}
