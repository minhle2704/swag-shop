const dotenv = require("dotenv");
const nodemailer = require("nodemailer");
const { google } = require("googleapis");

exports.sendEmail = async function (mailOptions) {
  dotenv.config();

  const oauth2Client = new google.auth.OAuth2(
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

  await smtpTransport.sendMail({ ...mailOptions, from: process.env.EMAIL });
};
