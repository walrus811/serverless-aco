const { ddbDocClient } = require("./dynamodbClient");

/**
 * @callback updateSortKeyValueCallback
 * @param {string} value
 * @returns {string}
 */

/**
 * @description query to DynamoDB
 * @param  {string} tableName
 * @param  {string} partialProjectExp
 * @param  {import("./typedefs").PK_SCHOOL} partition
 * @param  {number |undefined} limit
 * @param  {string | undefined} lastId
 * @param  {boolean} ascend
 * @param  {boolean} full
 * @returns {Promise<import("@aws-sdk/lib-dynamodb").QueryCommandOutput>}
 */
async function get(
  tableName,
  partialProjectExp,
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
      : partialProjectExp.length > 0
      ? partialProjectExp
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
 * @param  {import("./typedefs").DDBItem} item
 * @returns {Promise<import("@aws-sdk/lib-dynamodb").QueryCommandOutput>}
 */
async function post(tableName, item) {
  const queryResult = await ddbDocClient.put({
    TableName: tableName,
    Item: item,
    ConditionExpression:
      "attribute_not_exists(PK) and attribute_not_exists(SK)",
  });
  return queryResult;
}

/**
 * @description create new item to DynamoDB
 * @param  {string} tableName
 * @param  {import("./typedefs").DDBItem} item
 * @returns {Promise<import("@aws-sdk/lib-dynamodb").QueryCommandOutput>}
 */
async function put(tableName, item) {
  const queryResult = await ddbDocClient.put({
    TableName: tableName,
    Item: item,
  });
  return queryResult;
}

/**
 * @description create new item to DynamoDB
 * @param  {string} tableName
 * @param  {import("./typedefs").DDBItem} item
 * @returns {Promise<import("@aws-sdk/lib-dynamodb").QueryCommandOutput>}
 */
async function deleteItem(tableName, item) {
  const queryResult = await ddbDocClient.delete({
    TableName: tableName,
    Key: { PK: item.PK, SK: item.SK },
  });
  return queryResult;
}

module.exports = {
  get,
  getById,
  post,
  put,
  deleteItem,
};
