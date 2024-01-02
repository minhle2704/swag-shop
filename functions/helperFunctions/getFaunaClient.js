const dotenv = require("dotenv");
const faunadb = require("faunadb");

exports.getFaunaClient = function () {
  dotenv.config();

  const q = faunadb.query;

  const secret = process.env.FAUNA_SECRET;

  const faunaClient = new faunadb.Client({
    secret,
  });

  return {
    q,
    faunaClient,
  };
};
