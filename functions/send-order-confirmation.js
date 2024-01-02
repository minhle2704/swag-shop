const { getFaunaClient } = require("./helperFunctions/getFaunaClient");
const { sendEmail } = require("./helperFunctions/sendEmail");

exports.handler = async function handler(event, context) {
  try {
    const { q, faunaClient } = getFaunaClient();
    const { user, confirmedOrderNumber } = JSON.parse(event.body);

    const result = await faunaClient.query(
      q.Get(q.Ref(q.Collection("Order"), confirmedOrderNumber))
    );

    const mailOptions = {
      to: user.email,
      subject: `Swag Shop / Order Confirmation #${confirmedOrderNumber}`,
      generateTextFromHTML: true,
      text: `Hi ${
        user.firstName
      }, you have placed a successful order with our Swag Shop. Here is the confirmation order number #${confirmedOrderNumber}. Here is what you have ordered: ${JSON.stringify(
        result.data.order
      )}`,
    };

    if (result) {
      await sendEmail(mailOptions);

      return {
        statusCode: 200,
        body: JSON.stringify({
          message: "Email sent",
        }),
      };
    } else {
      return {
        statusCode: 401,
        body: JSON.stringify({
          message: "Order Not found",
        }),
      };
    }
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: `Failed to send email confirmation: ${error.message}. Please try again or contact Administrator at minhtrinh13555@gmail.com`,
      }),
    };
  }
};
