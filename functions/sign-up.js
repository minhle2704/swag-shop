const bcrypt = require("bcryptjs");
const { getFaunaClient } = require("./helperFunctions/getFaunaClient");

exports.handler = async function handler(event, context) {
  try {
    const { q, faunaClient } = getFaunaClient();
    const { firstName, lastName, email, username, password } = JSON.parse(
      event.body
    );
    const salt = bcrypt.genSaltSync(10);

    const result = await faunaClient.query(
      q.If(
        q.Or(
          q.Exists(q.Match(q.Index("unique_username"), username)),
          q.Exists(q.Match(q.Index("unique_email"), email))
        ),
        null,
        q.Create(q.Collection("Customer"), {
          data: {
            firstName,
            lastName,
            email,
            username,
            password: bcrypt.hashSync(password, salt),
            orders: [],
            role: "user",
            cartItem: "{}",
          },
        })
      )
    );

    if (result) {
      delete result.data.password;
      return {
        statusCode: 200,
        body: JSON.stringify({
          message: result,
        }),
      };
    } else {
      return {
        statusCode: 401,
        body: JSON.stringify({
          message: "Your username and/or your email is not available",
        }),
      };
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
