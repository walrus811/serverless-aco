const { ddbDocClient } = require("../client");
const { result: tableSchema } = require("../input/table.json");

(async () => {
  try {
    const data = await ddbDocClient.scan({
      TableName: tableSchema.TableName,
      IndexName: tableSchema.GlobalSecondaryIndexes[0].IndexName,
      FilterExpression: "#gsi1index = :gsi1index",
      ExpressionAttributeNames: {
        "#gsi1index": "StudentIndexKey",
      },
      ExpressionAttributeValues: {
        ":gsi1index": "Student#S#해양중#3#이택주",
      },
    });
    console.log(data);
  } catch (err) {
    console.log("Error", err);
  }
})();
