const { ddbDocClient } = require("../client");
const { result: tableSchema } = require("../input/table.json");
const { v4: uuidv4 } = require("uuid");

(async () => {
  try {
    const fileItem = {
      PK: "File",
      SK: `V#input`,
      Path: "/voca/input.json",
    };

    const putResult = await ddbDocClient.put({
      TableName: tableSchema.TableName,
      Item: fileItem,

      ConditionExpression : "attribute_not_exists(PK) and attribute_not_exists(SK)"
    });
    console.log("put", putResult);

    const vtSk = `VT#${uuidv4()}`;
    const vtItem = {
      PK: vtSk,
      SK: vtSk,
      Test: "안녕하세용2",
      CreateadAt: new Date().toISOString(),
      StudentIndexKey: "Student#S#해양중#3#이택주",
      ItemIndexKey: vtSk,
    };

    await ddbDocClient.put({
      TableName: tableSchema.TableName,
      Item: vtItem,
    });

    console.log("done");
  } catch (err) {
    console.log("Error", err);
  }
})();
