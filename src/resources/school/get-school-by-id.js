const _ = require("lodash");
const {
  createDefaultResponse,
  createDefaultClientErrorResponse,
  createDefaultNotFoundResponse,
  createDefaultInternalErrorResponse,
} = require("/opt/nodejs/util");
const { getSchoolById, getSchoolItem } = require("/opt/nodejs/school");

/**
 * @param  {import("aws-lambda").APIGatewayProxyEvent} event
 * @returns {Promise<import("aws-lambda").APIGatewayProxyResult>}
 */
exports.handler = async (event) => {
  const id = event.pathParameters?.id;

  if (!id)
    return createDefaultClientErrorResponse("There's no id in the request.");

  try {
    const result = await getSchoolById(id);
    const item = _.head(result.Items);

    if (!item)
      return createDefaultNotFoundResponse(`There's no item of ${id}.`);

    const responseBody = JSON.stringify({
      result: getSchoolItem(item),
    });

    const response = createDefaultResponse(
      result.$metadata.httpStatusCode ?? 500,
      responseBody
    );

    console.info(
      `response from: ${event.path} statusCode: ${response.statusCode} body: ${response.body}`
    );

    return response;
  } catch (error) {
    console.error(`error occurred, body: ${JSON.stringify(error)}`);
    const response = createDefaultInternalErrorResponse("");
    return response;
  }
};
