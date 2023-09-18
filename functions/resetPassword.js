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

  const getFauna = require("./helper/getFaunaClient");
  const { q, faunaClient } = await getFauna.handler();

  const result = await faunaClient.query(
    q.Get(q.Ref(q.Collection("Customer"), "376518753368670276"))
  );

  const emailAddress = result.data.emailAddress;

  const mailOptions = {
    from: process.env.EMAIL,
    to: emailAddress,
    subject: "Password Reset Link",
    generateTextFromHTML: true,
    text: "Hi Tom, please use this temporary password to reset your password. Thanks",
  };

  await smtpTransport.sendMail(mailOptions);

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: "Email Sent",
    }),
  };
};
