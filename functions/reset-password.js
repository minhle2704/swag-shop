const bcrypt = require("bcryptjs");
const { getFaunaClient } = require("./helperFunctions/getFaunaClient");

exports.handler = async function handler(event, context) {
  try {
    const { q, faunaClient } = getFaunaClient();
    const { username, temporaryPassword, newPassword } = JSON.parse(event.body);
    const salt = bcrypt.genSaltSync(10);
    const hashedNewPassword = bcrypt.hashSync(newPassword, salt);

    const result = await faunaClient.query(
      q.If(
        q.Exists(
          q.Match(q.Index("username_tempPassword"), username, temporaryPassword)
        ),
        q.Update(
          q.Select(
            "ref",
            q.Get(
              q.Match(
                q.Index("username_tempPassword"),
                username,
                temporaryPassword
              )
            )
          ),
          { data: { password: hashedNewPassword } }
        ),
        null
      )
    );

    if (result) {
      return {
        statusCode: 200,
        body: JSON.stringify({
          message:
            "Password reset successfully. Please use your new reset password to log in",
        }),
      };
    } else {
      throw new Error(`Falsy result from Fauna: ${result}`);
    }
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: `Failed to reset password: ${error.message}. Please try again or contact Administrator at minhtrinh13555@gmail.com`,
      }),
    };
  }
};
