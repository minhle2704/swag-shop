const { getFaunaClient } = require("./helperFunctions/getFaunaClient");

exports.handler = async function handler(event, context) {
  try {
    const { q, faunaClient } = getFaunaClient();
    const { userId, swagOrders } = JSON.parse(event.body);

    const result = await faunaClient.query(
      q.Update(q.Ref(q.Collection("Customer"), userId), {
        data: { cartItem: JSON.stringify(swagOrders) },
      })
    );

    if (result) {
      return {
        statusCode: 200,
        body: JSON.stringify({
          message: result.data.cartItem,
        }),
      };
    } else {
      throw new Error(`Falsy result from Fauna: ${result}`);
    }
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: `Failed to record cart items: ${error.message}. Please try again or contact Administrator at minhtrinh13555@gmail.com`,
      }),
    };
  }
};
