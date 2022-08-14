const { DeleteTableCommand } = require("@aws-sdk/client-dynamodb");
const { ddbClient } = require("../client");
const { result: tableSchema } = require("../input/table.json");

(async () => {
  try {
    const deleteStudent = await ddbClient.send(
      new DeleteTableCommand({ TableName: tableSchema.TableName })
    );
    console.log("Student deleted", deleteStudent);
  } catch (err) {
    if (!err.name?.includes("ResourceNotFoundException"))
      console.log("Error", err);
  }
})();
