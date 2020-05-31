const nodemailer = require('nodemailer')
const Email = require('email-templates')

const config = require('../../config')

const send = async (to, template, locals, attachments) => {
  try {
    const transport = config.nodemailer.transport === 'smtp' ? config.nodemailer.smtp : {
      sendmail: true,
      newline: 'unix',
      path: '/usr/sbin/sendmail'
    }
    const transporter = nodemailer.createTransport(transport)
    const email = new Email({
      message: {
        from: config.nodemailer.from
      },
      transport: transporter,
      subjectPrefix: `[${config.application.name}] `,
      views: {
        options: {
          extension: 'ejs'
        }
      },
      juice: true,
      juiceResources: {
        preserveImportant: true,
        webResources: {
          relativeTo: `${__dirname}/templates/${config.email.template.directory}`
        }
      }
    })
    locals.logo = config.email.template.logo
    locals.applicationName = config.application.name
    const result = await email.send({
      template: `${__dirname}/templates/${config.email.template.directory}/${template}`,
      message: {
        to
      },
      locals
    })
    return result

    // const transporter = nodemailer.createTransport(transport)
    // const result = await transporter.sendMail({
    //   from: config.nodemailer.from,
    //   to,
    //   subject,
    //   text,
    //   html,
    //   attachments
    // })
    // console.log(`To: ${to}, Subject: ${subject}, Success`)
    // return result
  } catch (e) {
    console.log(`To: ${to}, Template: ${template}, Error: ${e.message}`)
    return {
      error: e.message
    }
  }
}

module.exports = {
  send
}
