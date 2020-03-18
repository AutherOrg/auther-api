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
    host: process.env.NODEMAILER_HOST,
    port: process.env.NODEMAILER_PORT,
    auth: {
      user: process.env.NODEMAILER_USER,
      pass: process.env.NODEMAILER_PASS
    },
    debug: true,
    logger: true
  },
  permanentTokenLoginUrl: process.env.PERMANENT_TOKEN_LOGIN_URL,
  validatePasswordUrl: process.env.VALIDATE_PASSWORD_URL,
  applicationName: process.env.APPLICATION_NAME,
  debug: process.env.DEBUG
}
