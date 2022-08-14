const { ddbDocClient } = require("../client");
const { result: tableSchema } = require("../input/table.json");

(async () => {
  try {
    const data = await ddbDocClient.scan({
      TableName: tableSchema.TableName,
    });
    console.log(data);
  } catch (err) {
    console.log("Error", err);
  }
})();
