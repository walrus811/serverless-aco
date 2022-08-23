const _ = require("lodash");
const {
  createDefaultBadRequestResponse,
  createDefaultInternalErrorResponse,
  createDefaultConflictResponse,
  createDefaultCreatedResponse,
} = require("/opt/nodejs/util");
const { postSchool } = require("/opt/nodejs/school");
const { DEFAULT_HEADER } = require("/opt/nodejs/contants");

/**
 * @param  {import("aws-lambda").APIGatewayProxyEvent} event
 * @returns {Promise<import("aws-lambda").APIGatewayProxyResult>}
 */
exports.handler = async (event) => {
  if (!event.body)
    return createDefaultBadRequestResponse("no data in the request.");
  const body = JSON.parse(event.body);
  if (!_.trim(body.name))
    return createDefaultBadRequestResponse("no name in the request.");

  try {
    await postSchool({ name: body.name });

    const response = createDefaultCreatedResponse("");
    if (!response.headers) response.headers = DEFAULT_HEADER;
    _.set(response.headers, "Content-Location", `${event.path}/${body.name}`);

    console.info(
      `response from: ${event.path} statusCode: ${response.statusCode} body: ${response.body}`
    );

    return response;
  } catch (error) {
    if (
      error.__type ===
      "com.amazonaws.dynamodb.v20120810#ConditionalCheckFailedException"
    ) {
      console.info(
        `resource conflict occurred, body: ${JSON.stringify(error)}`
      );
      const response = createDefaultConflictResponse("");
      if (!response.headers) response.headers = DEFAULT_HEADER;
      _.set(
        response.headers,
        "Content-Location",
        `${event.path}/${body.name}`
      );
      return response;
    } else {
      console.error(`error occurred, body: ${JSON.stringify(error)}`);
      return createDefaultInternalErrorResponse("");
    }
  }
};
