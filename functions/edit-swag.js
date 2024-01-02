const { getFaunaClient } = require("./helperFunctions/getFaunaClient");

exports.handler = async function handler(event, context) {
  try {
    const { q, faunaClient } = getFaunaClient();
    const { ref, name, quantity, category, image } = JSON.parse(event.body);
    const editedSwag = {
      ref,
      name,
      quantity: parseInt(quantity),
      category,
      image,
    };

    const result = await faunaClient.query(
      q.Update(q.Ref(q.Collection("Swags"), ref), {
        data: editedSwag,
      })
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
        message: `Failed to edit swag: ${error.message}. Please try again or contact Administrator at minhtrinh13555@gmail.com`,
      }),
    };
  }
};
