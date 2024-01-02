const { getFaunaClient } = require("./helperFunctions/getFaunaClient");

exports.handler = async function handler(event, context) {
  try {
    const { q, faunaClient } = getFaunaClient();
    const { id } = JSON.parse(event.body);

    const result = await faunaClient.query(
      q.Do(
        q.Update(q.Ref(q.Collection("Swags"), id), {
          data: { archive: true },
        }),
        q.Filter(
          q.Map(
            q.Paginate(q.Documents(q.Collection("Swags"))),
            q.Lambda("ref", q.Get(q.Var("ref")))
          ),
          q.Lambda(
            "swag",
            q.Equals(
              q.Select("archive", q.Select("data", q.Var("swag"))),
              false
            )
          )
        )
      )
    );

    if (result) {
      return {
        statusCode: 200,
        body: JSON.stringify({
          message: result.data,
        }),
      };
    } else {
      throw new Error(`Falsy result from Fauna: ${result}`);
    }
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: `Unable to delete swag: ${error.message}. Please try again or contact Administrator at minhtrinh13555@gmail.com`,
      }),
    };
  }
};
