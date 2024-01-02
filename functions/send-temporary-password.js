const { getFaunaClient } = require("./helperFunctions/getFaunaClient");
const {
  generateTemporaryPassword,
} = require("./helperFunctions/generateTemporaryPassword");
const { sendEmail } = require("./helperFunctions/sendEmail");

exports.handler = async function handler(event, context) {
  try {
    const { q, faunaClient } = getFaunaClient();
    const emailAddress = JSON.parse(event.body);

    const temporaryPassword = generateTemporaryPassword();

    const mailOptions = {
      to: emailAddress.email,
      subject: "Password Reset Link",
      generateTextFromHTML: true,
      text: `Hi, please use this temporary password ${temporaryPassword} to reset your password. Thanks`,
    };

    const result = await faunaClient.query(
      q.If(
        q.Exists(q.Match(q.Index("unique_email"), emailAddress.email)),
        q.Update(
          q.Select(
            "ref",
            q.Get(q.Match(q.Index("unique_email"), emailAddress.email))
          ),
          { data: { temporaryPassword } }
        ),
        null
      )
    );

    if (result) {
      await sendEmail(mailOptions);
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        message:
          "If this is the email address used to register your account, you will receive an email with a temporary password. Please check your mailbox and follow the instruction to reset your password.",
      }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: `Failed to send temporary email: ${error.message}. Please try again or raise a ticket to Administrator minhtrinh13555@gmail.com`,
      }),
    };
  }
};
