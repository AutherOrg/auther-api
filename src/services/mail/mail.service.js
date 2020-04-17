const nodemailer = require('nodemailer')

const config = require('../../config')

const send = async (to, subject, text, html, attachments) => {
  try {
    const transport = config.nodemailer.transport === 'smtp' ? config.nodemailer.smtp : {
      sendmail: true,
      newline: 'unix',
      path: '/usr/sbin/sendmail'
    }
    const transporter = nodemailer.createTransport(transport)
    const result = await transporter.sendMail({
      from: config.nodemailer.from,
      to,
      subject,
      text,
      html,
      attachments
    })
    console.log(`To: ${to}, Subject: ${subject}, Success`)
    return result
  } catch (e) {
    console.log(`To: ${to}, Subject: ${subject}, Error: ${e.message}`)
    return {
      error: e.message
    }
  }
}

module.exports = {
  send
}
