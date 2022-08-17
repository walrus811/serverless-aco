exports.handler = async (event) => {
  const response = {
    statusCode: 200,
    body: process.env.AWS_DYNAMODB_END_POINT,
  };
  // All log statements are written to CloudWatch
  console.info(
    `response from: ${event.path} statusCode: ${response.statusCode} body: ${response.body}`
  );
  return response;
};
