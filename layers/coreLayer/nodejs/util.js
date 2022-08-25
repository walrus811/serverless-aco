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
 * @param {Record<string,any> | undefined} body
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
        body: JSON.stringify(body),
        headers,
        multiValueHeaders,
        isBase64Encoded,
    };
}

/**
 *
 * @param {number} statusCode
 * @param {string | undefined} message
 * @returns {import("aws-lambda").APIGatewayProxyResult}
 */
function createDefaltErrorResponse(statusCode, message) {
    return createResponse(
        DEFAULT_HEADER,
        undefined,
        undefined,
        statusCode,
        message
            ? {
                  message,
              }
            : undefined
    );
}

const createDefaultResponse = _.partial(
    createResponse,
    DEFAULT_HEADER,
    undefined,
    undefined
);

const createDefaultCreatedResponse = _.partial(
    createResponse,
    DEFAULT_HEADER,
    undefined,
    undefined,
    201
);

const createDefaultNoContentsResponse = _.partial(
    createResponse,
    DEFAULT_HEADER,
    undefined,
    undefined,
    204
);

const createDefaultBadRequestResponse = _.partial(
    createDefaltErrorResponse,
    400
);

const createDefaultNotFoundResponse = _.partial(createDefaltErrorResponse, 404);

const createDefaultConflictResponse = _.partial(createDefaltErrorResponse, 409);

const createDefaultInternalErrorResponse = _.partial(
    createDefaltErrorResponse,
    500
);

module.exports = {
    parseQueryParam,
    createResponse,
    createDefaultResponse,
    createDefaultCreatedResponse,
    createDefaultNoContentsResponse,
    createDefaultBadRequestResponse,
    createDefaultNotFoundResponse,
    createDefaultConflictResponse,
    createDefaultInternalErrorResponse,
};
