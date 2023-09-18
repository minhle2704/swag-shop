exports.handler = async function handler(event, context) {
  const dotenv = require("dotenv");
  dotenv.config();
  const nodemailer = require("nodemailer");
  const { google } = require("googleapis");
  const OAuth2 = google.auth.OAuth2;

  const oauth2Client = new OAuth2(
    process.env.OAUTH_CLIENTID,
    process.env.OAUTH_CLIENT_SECRET,
    "https://developers.google.com/oauthplayground"
  );

  oauth2Client.setCredentials({
    refresh_token: process.env.OAUTH_REFRESH_TOKEN,
  });

  const accessToken = oauth2Client.getAccessToken();

  const smtpTransport = nodemailer.createTransport({
    service: "gmail",
    auth: {
      type: "OAuth2",
      user: process.env.EMAIL,

      clientId: process.env.OAUTH_CLIENTID,
      clientSecret: process.env.OAUTH_CLIENT_SECRET,
      refreshToken: process.env.OAUTH_REFRESH_TOKEN,
      accessToken: accessToken,
    },
  });

  smtpTransport.verify((err, success) => {
    err ? console.log(err) : console.log("Transporter is ready");
  });

  const mailOptions = {
    from: process.env.EMAIL,
    generateTextFromHTML: true,
  };

  await smtpTransport.sendMail(mailOptions);

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: "Email Sent",
    }),
  };
};
