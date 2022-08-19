const { ddbDocClient } = require("./dynamodbClient");
const _ = require("lodash");

module.exports = async function getSchool(
  tableName,
  limit,
  lastIdTuple,
  ascend,
  full,
  projectionExp
) {
  const [pk, sk] = lastIdTuple;
  const data = await ddbDocClient.query({
    TableName: tableName,
    KeyConditionExpression: "#pk = :pk",
    ExpressionAttributeNames: {
      "#pk": "PK",
    },
    ExpressionAttributeValues: {
      ":pk": pk,
    },
    Limit: limit,
    ExclusiveStartKey: sk ? { SK: sk, PK: pk } : undefined,
    ScanIndexForward: ascend,
    ProjectionExpression: full ? undefined : projectionExp,
  });

  return data;
};
