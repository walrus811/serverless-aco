const { ddbDocClient } = require("./dynamodbClient");

/**
 * @typedef {import("./contants").PK_SCHOOL} PK_SCHOOL
 */

/**
 * @description query to DynamoDB
 * @param  {string} tableName
 * @param  {string} partialExp
 * @param  {PK_SCHOOL} partition
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
    KeyConditionExpression: `#pk = :pk`,
    ExpressionAttributeNames: {
      "#pk": "PK",
    },
    ExpressionAttributeValues: {
      ":pk": partition,
    },
    Limit: limit,
    ExclusiveStartKey: lastId ? { SK: lastId, PK: partition } : undefined,
    ScanIndexForward: ascend,
    ProjectionExpression: full
      ? undefined
      : partialExp.length > 0
      ? partialExp
      : undefined,
  });

  return queryResult;
}

module.exports = {
  get,
};
