const { ddbDocClient } = require("./dynamodbClient");
const _ = require("lodash");

/**
 * @callback updateSortKeyValueCallback
 * @param {string} value
 * @returns {string}
 */

/**
 * @description query to DynamoDB
 * @param  {string} tableName
 * @param  {string} partialExp
 * @param  {import("./typedefs").PK_SCHOOL} partition
 * @param  {number |undefined} limit
 * @param  {string | undefined} lastId
 * @param  {boolean} ascend
 * @param  {boolean} full
 * @returns {Promise<import("@aws-sdk/lib-dynamodb").QueryCommandOutput>}
 */
async function get(
  tableName,
  partialExp,
  partition,
  limit,
  lastId,
  ascend,
  full
) {
  const queryResult = await ddbDocClient.query({
    TableName: tableName,
    KeyConditionExpression: `#pk = :pk${
      lastId ? ` and #sk ${ascend ? ">" : "<"} :sk` : ""
    }`,
    ExpressionAttributeNames: lastId
      ? {
          "#pk": "PK",
          "#sk": "SK",
        }
      : {
          "#pk": "PK",
        },
    ExpressionAttributeValues: lastId
      ? {
          ":pk": partition,
          ":sk": lastId,
        }
      : {
          ":pk": partition,
        },
    Limit: limit,
    ScanIndexForward: ascend,
    ProjectionExpression: full
      ? undefined
      : partialExp.length > 0
      ? partialExp
      : undefined,
  });

  return queryResult;
}

/**
 * @description query by id to DynamoDB
 * @param  {string} tableName
 * @param  {import("./typedefs").PK_SCHOOL} partition
 * @param  {string} id
 * @returns {Promise<import("@aws-sdk/lib-dynamodb").QueryCommandOutput>}
 */
async function getById(tableName, partition, id) {
  const queryResult = await ddbDocClient.query({
    TableName: tableName,
    KeyConditionExpression: `#pk = :pk and #sk = :sk`,
    ExpressionAttributeNames: {
      "#pk": "PK",
      "#sk": "SK",
    },
    ExpressionAttributeValues: {
      ":pk": partition,
      ":sk": id,
    },
  });

  return queryResult;
}

/**
 * @description create new item to DynamoDB
 * @param  {string} tableName
 * @param  {import("./typedefs").PK_SCHOOL} partition
 * @param {string} sortKeyField
 * @param {updateSortKeyValueCallback} updateSortKeyValue
 * @param  {import("./typedefs").School} data
 * @returns {Promise<import("@aws-sdk/lib-dynamodb").QueryCommandOutput>}
 */
async function post(
  tableName,
  partition,
  sortKeyField,
  updateSortKeyValue,
  data
) {
  const postData = createPutData(
    partition,
    sortKeyField,
    updateSortKeyValue,
    data
  );
  const queryResult = await ddbDocClient.put({
    TableName: tableName,
    Item: postData,
    ConditionExpression:
      "attribute_not_exists(PK) and attribute_not_exists(SK)",
  });

  return queryResult;
}

/**
 * @description create data to put to dynamodb
 * @param  {import("./typedefs").PK_SCHOOL} partition
 * @param  {string} sortKeyField
 * @param {updateSortKeyValueCallback} updateSortKeyValue
 * @param  {import("./typedefs").School} data
 * @returns {object}
 */
function createPutData(partition, sortKeyField, updateSortKeyValue, data) {
  const newObject = _.flow([
    _.partialRight(_.set, "PK", partition),
    _.partialRight(_.mapKeys, function (_, key) {
      return key === sortKeyField ? "SK" : key;
    }),
    _.partialRight(_.update, "SK", updateSortKeyValue),
    _.partialRight(_.omit, sortKeyField),
  ])(data);
  return newObject;
}

module.exports = {
  get,
  getById,
  post,
};
