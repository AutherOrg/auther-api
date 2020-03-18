const nodemailer = require('nodemailer')

const config = require('../../config')

const send = async (from, to, subject, text, html, attachments) => {
  const message = {
    from,
    to,
    subject,
    text,
    html,
    attachments
  }
  try {
    const transporter = nodemailer.createTransport(config.nodemailer)
    const result = await transporter.sendMail(message)
    if (config.debug === 'true') {
      console.log(result)
    }
    return result
  } catch (e) {
    console.error(e.message)
    if (config.debug === 'true') {
      console.log(message)
    }
    return {
      error: e.message
    }
  }
}

module.exports = {
  send
}
