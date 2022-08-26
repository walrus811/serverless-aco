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
  putSchool,
  createPutDDBItem,
  createDeleteDDBItem,
  getSortKey,
} = require("/opt/nodejs/school");
const { DEFAULT_HEADER } = require("/opt/nodejs/contants");

/**
 * @param  {import("aws-lambda").APIGatewayProxyEvent} event
 * @returns {Promise<import("aws-lambda").APIGatewayProxyResult>}
 */
exports.handler = async (event) => {
  const id = event.pathParameters?.id;

  if (!id)
    return createDefaultBadRequestResponse("There's no id in the request.");

  if (!event.body)
    return createDefaultBadRequestResponse("no data in the request.");

  const body = JSON.parse(event.body);

  try {
    const result = await getSchoolById(id);
    const item = _.head(result.Items);

    if (!item)
      return createDefaultNotFoundResponse(`There's no item of ${id}.`);

    const deleteDDBItem = createDeleteDDBItem(item);
    await deleteSchool(deleteDDBItem);

    const updateItem = { name: body.name ? body.name : item.SK };

    const newSortKey = getSortKey(updateItem);
    const ddbItem = createPutDDBItem(item, newSortKey, updateItem);
    await putSchool(ddbItem);

    const response = createDefaultNoContentsResponse(undefined);
    if (!response.headers) response.headers = DEFAULT_HEADER;
    _.set(
      response.headers,
      "Content-Location",
      `/${event.path.split("/")[1]}/${ddbItem.SK}`
    );
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
