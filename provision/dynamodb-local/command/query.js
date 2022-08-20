const { ddbDocClient } = require("../client");
const { result: tableSchema } = require("../input/table.json");

(async () => {
  try {
    const data = await ddbDocClient.query({
      TableName: tableSchema.TableName,
      KeyConditionExpression: "#pk = :pk",
      ExpressionAttributeNames: {
        "#pk": "PK",
      },
      ExpressionAttributeValues: {
        ":pk": "Test",
      },
      Limit: 1,
      ExclusiveStartKey: { PK: "Test", SK: "Fir" },
    });
    console.log(data);
  } catch (err) {
    console.log("Error", err);
  }
})();
