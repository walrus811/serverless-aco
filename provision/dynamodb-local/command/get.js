const { ddbDocClient } = require("../client");
const { result: tableSchema } = require("../input/table.json");

(async () => {
  try {
    const { result: students } = require("../input/student.json");
    const student = students[0];
    const item = {
      PK: "Student",
      SK: `S#${student.school}#${student.grade}`,
    };
    const data = await ddbDocClient.query({
      TableName: tableSchema.TableName,
      KeyConditionExpression: "#pk = :pk and begins_with(#sk, :sk)",
      ExpressionAttributeNames: {
        "#pk": "PK",
        "#sk": "SK",
      },
      ExpressionAttributeValues: {
        ":pk": item.PK,
        ":sk": item.SK,
      },
    });
    console.log(data);
  } catch (err) {
    console.log("Error", err);
  }
})();
