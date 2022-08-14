const { CreateTableCommand } = require("@aws-sdk/client-dynamodb");
const { ddbClient } = require("../client");
const { result: tableSchema } = require("../input/table.json");

(async () => {
  try {
    const studentTableCreated = await ddbClient.send(
      new CreateTableCommand(tableSchema)
    );
    console.log("Aco Table Created", studentTableCreated);
  } catch (err) {
    if (err.name?.includes("ResourceInUseException"))
      console.log("table already exist");
    else console.log("Error", err);
  }
})();
