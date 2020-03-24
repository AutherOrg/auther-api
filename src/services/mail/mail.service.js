const nodemailer = require('nodemailer')

const config = require('../../config')

const send = async (from, to, subject, text, html, attachments) => {
  try {
    const transport = config.nodemailer.transport === 'smtp' ? config.nodemailer.smtp : {
      sendmail: true,
      newline: 'unix',
      path: '/usr/sbin/sendmail'
    }
    const transporter = nodemailer.createTransport(transport)
    const result = await transporter.sendMail({
      from,
      to,
      subject,
      text,
      html,
      attachments
    })
    console.log(to, text, 'success')
    return result
  } catch (e) {
    console.error(to, text, e.message)
    return {
      error: e.message
    }
  }
}

module.exports = {
  send
}
