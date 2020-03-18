const nodemailer = require('nodemailer')

const config = require('../../config')

const send = async (from, to, subject, text, html, attachments) => {
  try {
    // const transporter = nodemailer.createTransport(config.nodemailer)
    const transporter = nodemailer.createTransport({
      sendmail: true,
      newline: 'unix',
      path: '/usr/sbin/sendmail'
    })
    const result = await transporter.sendMail({
      from,
      to,
      subject,
      text,
      html,
      attachments
    })
    if (config.debug === 'true') {
      console.log(to, subject, text)
    }
    return result
  } catch (e) {
    console.error(e.message)
    if (config.debug === 'true') {
      console.log(to, subject, text)
    }
    return {
      error: e.message
    }
  }
}

module.exports = {
  send
}
