const nodemailer = require('nodemailer')

const config = require('../../config')

const send = async (from, to, subject, text, html) => {
  try {
    const transporter = nodemailer.createTransport(config.nodemailer)
    const result = await transporter.sendMail({
      from,
      to,
      subject,
      text
    })
    return result
  } catch (e) {
    return {
      error: e.message
    }
  }
}

module.exports = {
  send
}
