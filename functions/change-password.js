const bcrypt = require("bcryptjs");
const { getFaunaClient } = require("./helperFunctions/getFaunaClient");

exports.handler = async function handler(event, context) {
  try {
    const { q, faunaClient } = getFaunaClient();
    const { userId, currentPassword, newPassword } = JSON.parse(event.body);

    const user = await faunaClient.query(
      q.Get(q.Ref(q.Collection("Customer"), userId))
    );

    if (bcrypt.compareSync(currentPassword, user.data.password)) {
      const salt = bcrypt.genSaltSync(10);

      await faunaClient.query(
        q.Update(user.ref, {
          data: {
            password: bcrypt.hashSync(newPassword, salt),
          },
        })
      );

      return {
        statusCode: 200,
        body: JSON.stringify({
          message: "Password Update Successful",
        }),
      };
    } else {
      return {
        statusCode: 401,
        body: JSON.stringify({
          message: "Wrong Password",
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
