exports.handler = async function getFaunaClient(event, context, callback) {
  const dotenv = require("dotenv");

  dotenv.config();

  var faunadb = require("faunadb"),
    q = faunadb.query;

  const secret = process.env.FAUNA_SECRET;

  const faunaClient = new faunadb.Client({
    secret,
  });

  return {
    q,
    faunaClient,
    // statusCode: 200,
    // body: JSON.stringify({
    //   message: { q, faunaClient },
    // }),
  };
};
