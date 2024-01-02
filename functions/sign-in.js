const bcrypt = require("bcryptjs");
const { getFaunaClient } = require("./helperFunctions/getFaunaClient");

exports.handler = async function handler(event, context) {
  try {
    const { q, faunaClient } = getFaunaClient();
    const { username, password } = JSON.parse(event.body);

    const result = await faunaClient.query(
      q.If(
        q.Exists(q.Match(q.Index("unique_username"), username)),
        q.Get(q.Match(q.Index("unique_username"), username)),
        null
      )
    );

    if (
      result &&
      result.data &&
      bcrypt.compareSync(password, result.data.password)
    ) {
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
          message: "Resource not found",
        }),
      };
    }
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: `Failed to update password: ${error.message}. Please try again or contact Administrator at minhtrinh13555@gmail.com`,
      }),
    };
  }
};
