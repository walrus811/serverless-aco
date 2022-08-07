const { v4: uuidv4 } = require("uuid");

exports.handler = async (event) => {
  const response = {
    statusCode: 200,
    body: "이젠 눈을 떠도 행복해" + uuidv4(),
  };
  // All log statements are written to CloudWatch
  console.info(
    `response from: ${event.path} statusCode: ${response.statusCode} body: ${response.body}`
  );
  return response;
};
