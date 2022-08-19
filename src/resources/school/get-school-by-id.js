const _ = require("lodash");

exports.handler = async (event) => {
  const nums = _.range(1, 10);
  const response = {
    statusCode: 200,
    body: nums.join(","),
  };
  // All log statements are written to CloudWatch
  console.info(
    `response from: ${event.path} statusCode: ${response.statusCode} body: ${response.body}`
  );
  return response;
};
