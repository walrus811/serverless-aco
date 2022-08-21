const _ = require("lodash");
const { DEFAULT_HEADER } = require("./contants");

/**
 * @typedef {object} QueryParam
 * @property {number | undefined} limit
 * @property {string | undefined} lastId
 * @property {boolean} ascend
 * @property {boolean} full
 * @typedef {Object.<string, boolean | number | string>} ApiGatewayHeaderKeyValuePair
 * @typedef {Object.<string, Array<boolean | number | string>>} ApiGatewayHeaderKeyValuesPair
 */

/**
 * @description parse the AWS API Gateway Proxt Event's query strings
 * @param  {import("aws-lambda").APIGatewayProxyEvent} event
 * @returns {QueryParam}
 */
function parseQueryParam(event) {
  if (!event.queryStringParameters)
    return {
      limit: undefined,
      lastId: undefined,
      ascend: false,
      full: false,
    };

  const limitValue = _.parseInt(event.queryStringParameters.limit ?? "");
  return {
    limit: limitValue > 0 ? limitValue : undefined,
    lastId: decodeURIComponent(event.queryStringParameters.lastId ?? ""),
    ascend: event.queryStringParameters?.ascend === "true",
    full: event.queryStringParameters.full === "true",
  };
}

/**
 *
 * @param {ApiGatewayHeaderKeyValuePair | undefined} headers
 * @param {ApiGatewayHeaderKeyValuesPair | undefined} multiValueHeaders
 * @param {boolean | undefined} isBase64Encoded
 * @param {number} statusCode
 * @param {string} body
 * @returns {import("aws-lambda").APIGatewayProxyResult}
 */
function createResponse(
  headers,
  multiValueHeaders,
  isBase64Encoded,
  statusCode,
  body
) {
  return {
    statusCode: statusCode,
    body,
    headers,
    multiValueHeaders,
    isBase64Encoded,
  };
}

const createDefaultResponse = _.partial(
  createResponse,
  DEFAULT_HEADER,
  undefined,
  undefined
);

module.exports = {
  parseQueryParam,
  createResponse,
  createDefaultResponse,
};
