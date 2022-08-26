const { ddbDocClient } = require("../client");
const { result: tableSchema } = require("../input/table.json");

(async () => {
  try {
    const item = {
      PK: "School",
      SK: `라라라고`,
    };
    const data = await ddbDocClient.delete({
      TableName: tableSchema.TableName,
      Key: item,
    });
    console.log(data);
  } catch (err) {
    console.log("Error", err);
  }
})();
