const _ = require("lodash");
const {
  parseQueryParam,
  createDefaultResponse,
  createDefaultInternalErrorResponse,
} = require("/opt/nodejs/util");
const { getSchool, getSchoolItem } = require("/opt/nodejs/school");

/**
 * @param  {import("aws-lambda").APIGatewayProxyEvent} event
 * @returns {Promise<import("aws-lambda").APIGatewayProxyResult>}
 */
exports.handler = async (event) => {
  const queryParam = parseQueryParam(event);

  try {
    const result = await getSchool(
      queryParam.limit,
      queryParam.lastId,
      queryParam.ascend,
      queryParam.full
    );

    const responseBody = {
      result: _.map(result.Items, getSchoolItem),
      lastId: result.LastEvaluatedKey ? result.LastEvaluatedKey.SK : null,
    };

    const response = createDefaultResponse(
      result.$metadata.httpStatusCode ?? 500,
      responseBody
    );

    console.info(
      `response from: ${event.path} statusCode: ${response.statusCode} body(count): ${responseBody.result.length}`
    );

    return response;
  } catch (error) {
    console.error(`error occurred, body: ${JSON.stringify(error)}`);
    const response = createDefaultInternalErrorResponse(undefined);
    return response;
  }
};
