const { getFaunaClient } = require("./helperFunctions/getFaunaClient");

exports.handler = async function handler(event, context) {
  const { q, faunaClient } = getFaunaClient();
  const { userId } = JSON.parse(event.body);

  const result = await faunaClient.query(
    q.Select("data", q.Get(q.Ref(q.Collection("Customer"), userId)))
  );

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: result.cartItem,
    }),
  };
};
