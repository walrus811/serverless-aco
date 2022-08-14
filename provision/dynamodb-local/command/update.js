const { ddbDocClient } = require("../client");
const { result: tableSchema } = require("../input/table.json");
const { v4: uuidv4 } = require("uuid");

(async () => {
  try {
    const stduentKey = {
      PK: "Student",
      SK: "S#해양중#3#이택주",
    };

    const result = await ddbDocClient.update({
      TableName: tableSchema.TableName,
      Key: stduentKey,
      UpdateExpression: "SET #phone=:phone",
      ExpressionAttributeNames: {
        "#phone": "Phone",
      },
      ExpressionAttributeValues: {
        ":phone": "010-111-1111",
      },
    });
    console.log(result);
    console.log("done");
  } catch (err) {
    console.log("Error", err);
  }
})();
