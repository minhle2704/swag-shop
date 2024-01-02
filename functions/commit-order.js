const { getFaunaClient } = require("./helperFunctions/getFaunaClient");

exports.handler = async function handler(event, context) {
  try {
    const { q, faunaClient } = getFaunaClient();
    const { userId, swagOrders, deliveryAddress, phoneNumber, date } =
      JSON.parse(event.body);
    const ids = Object.keys(swagOrders);

    const result = await faunaClient.query(
      q.If(
        q.ContainsValue(
          false,
          q.Map(
            ids,
            q.Lambda(
              "id",
              q.If(
                q.GTE(
                  q.Select(
                    "quantity",
                    q.Select(
                      "data",
                      q.Get(q.Ref(q.Collection("Swags"), q.Var("id")))
                    )
                  ),
                  q.Select("quantity", q.Select(q.Var("id"), swagOrders))
                ),
                q.Var("id"),
                false
              )
            )
          )
        ),
        null,
        q.Do(
          q.Foreach(
            ids,
            q.Lambda(
              "id",
              q.Update(q.Ref(q.Collection("Swags"), q.Var("id")), {
                data: {
                  quantity: q.Subtract(
                    q.Select(
                      "quantity",
                      q.Select(
                        "data",
                        q.Get(q.Ref(q.Collection("Swags"), q.Var("id")))
                      )
                    ),
                    q.Select("quantity", q.Select(q.Var("id"), swagOrders))
                  ),
                },
              })
            )
          ),

          q.Create(q.Collection("Order"), {
            data: {
              userId,
              order: swagOrders,
              deliveryAddress,
              phoneNumber,
              date,
            },
          })
        )
      )
    );

    if (result)
      return {
        statusCode: 200,
        body: JSON.stringify({
          message: result,
        }),
      };
    else {
      throw new Error(`Falsy result from Fauna: ${result}`);
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
