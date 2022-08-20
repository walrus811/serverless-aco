const _ = require("lodash");
const { parseQueryParam, createDefaultResponse } = require("/opt/nodejs/util");
const { getSchool } = require("/opt/nodejs/school");

/**
 * @param  {import("aws-lambda").APIGatewayProxyEvent} event
 * @returns {Promise<import("aws-lambda").APIGatewayProxyResult>}
 */
exports.handler = async (event) => {
  const queryParam = parseQueryParam(event);

  try
  {
    const result = await getSchool(
      queryParam.limit,
      queryParam.lastId,
      queryParam.ascend,
      queryParam.full
    );

    const responseBody = JSON.stringify({
      result: _.map(result.Items, function (item) {
        return {
          id: item.SK,
          name: item.SK,
        };
      }),
      lastId: result.LastEvaluatedKey ? result.LastEvaluatedKey.SK : null,
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

    const response = createDefaultResponse(
      error.$metadata.httpStatusCode ?? 500,
      ""
    );
    return response;
  }
};
