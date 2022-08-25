const _ = require("lodash");
const {
  createDefaultBadRequestResponse,
  createDefaultNotFoundResponse,
  createDefaultInternalErrorResponse,
  createDefaultNoContentsResponse,
} = require("/opt/nodejs/util");
const {
  getSchoolById,
  deleteSchool,
  createDeleteDDBItem,
} = require("/opt/nodejs/school");

/**
 * @param  {import("aws-lambda").APIGatewayProxyEvent} event
 * @returns {Promise<import("aws-lambda").APIGatewayProxyResult>}
 */
exports.handler = async (event) => {
  const id = event.pathParameters?.id;

  if (!id)
    return createDefaultBadRequestResponse("There's no id in the request.");

  try {
    const result = await getSchoolById(id);
    const item = _.head(result.Items);

    if (!item)
      return createDefaultNotFoundResponse(`There's no item of ${id}.`);

    const ddbItem = createDeleteDDBItem(item);
    await deleteSchool(ddbItem);

    const response = createDefaultNoContentsResponse(undefined);

    console.info(
      `response from: ${event.path} statusCode: ${response.statusCode} body: ${response.body}`
    );

    return response;
  } catch (error) {
    console.error(`error occurred, body: ${JSON.stringify(error)}`);
    const response = createDefaultInternalErrorResponse(undefined);
    return response;
  }
};
