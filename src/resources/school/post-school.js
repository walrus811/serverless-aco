const _ = require("lodash");
const {
  createDefaultBadRequestResponse,
  createDefaultInternalErrorResponse,
  createDefaultConflictResponse,
  createDefaultCreatedResponse,
} = require("/opt/nodejs/util");
const { postSchool, createPostDDBItem } = require("/opt/nodejs/school");
const { DEFAULT_HEADER, PK_SCHOOL } = require("/opt/nodejs/contants");

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
    const ddbItem = createPostDDBItem(PK_SCHOOL, { name: body.name });
    await postSchool(ddbItem);

    const response = createDefaultCreatedResponse(undefined);
    if (!response.headers) response.headers = DEFAULT_HEADER;
    _.set(response.headers, "Content-Location", `${event.path}/${ddbItem.SK}`);

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
      const response = createDefaultConflictResponse(undefined);
      if (!response.headers) response.headers = DEFAULT_HEADER;
      _.set(response.headers, "Content-Location", `${event.path}/${body.name}`);
      return response;
    } else {
      console.error(`error occurred, body: ${JSON.stringify(error)}`);
      return createDefaultInternalErrorResponse(undefined);
    }
  }
};
