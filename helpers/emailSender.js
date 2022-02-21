const nodemailer = require('nodemailer');
const Logger = require('./Logger');

/**
 * Sends email and SMS using Jamila's API
 * @param {Object} payload
 */
const sendEmailSms = async (payload) => {

  let testAccount = await nodemailer.createTestAccount();

  var transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      type: 'OAuth2',
      user: process.env.NODEMAILER_USER,
      pass: process.env.NODEMAILER_PASS,
      clientId: process.env.OAUTH_CLIENT_ID,
      clientSecret: process.env.OAUTH_CLIENT_SECRET,
      refreshToken: process.env.OAUTH_REFRESH_TOKEN
    }
  });

  var mailOptions = {
    from: 'oluwasegunayobami7@gmail.com',
    to: payload.emailRecipients,
    subject: payload.emailSubject,
    html: payload.emailBody,
    attachments: payload.attachments || []
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log('Error block', error);
    } else {
      Logger.log('Email sent: ' + info.response);
    }
  });

};

exports.sendEmailSms = sendEmailSms;
