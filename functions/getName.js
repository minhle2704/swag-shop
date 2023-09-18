// import faunadb, { query as q } from "faunadb";

exports.handler = async function handler(event, context) {
  const dotenv = require("dotenv");

  dotenv.config();

  const getFauna = require("./helper/getFaunaClient");
  const { q, faunaClient } = await getFauna.handler();

  const result = await faunaClient.query(
    q.Get(q.Ref(q.Collection("Customer"), "376518753368670276"))
  );

  const name = result.data.firstName;

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: name,
    }),
  };
};
