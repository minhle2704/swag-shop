const { getFaunaClient } = require("./helperFunctions/getFaunaClient");

exports.handler = async function handler(event, context) {
  const { q, faunaClient } = getFaunaClient();

  const result = await faunaClient.query(
    q.Filter(
      q.Map(
        q.Paginate(q.Documents(q.Collection("Swags"))),
        q.Lambda("ref", q.Get(q.Var("ref")))
      ),
      q.Lambda(
        "swag",
        q.Equals(q.Select("archive", q.Select("data", q.Var("swag"))), false)
      )
    )
  );

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: result.data,
    }),
  };
};
