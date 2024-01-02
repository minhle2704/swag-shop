const { getFaunaClient } = require("./helperFunctions/getFaunaClient");

exports.handler = async function handler(event, context) {
  try {
    const { q, faunaClient } = getFaunaClient();
    const { userId } = JSON.parse(event.body);

    const result = await faunaClient.query(
      q.Map(
        q.Paginate(q.Match(q.Index("order_list_by_userId"), userId)),
        q.Lambda("order", q.Get(q.Var("order")))
      )
    );

    if (result) {
      return {
        statusCode: 200,
        body: JSON.stringify({
          message: result,
        }),
      };
    } else {
      throw new Error(`Falsy result from Fauna: ${result}`);
    }
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: `Failed to fetch order: ${error.message}. Please try again or contact Administrator at minhtrinh13555@gmail.com`,
      }),
    };
  }
};
