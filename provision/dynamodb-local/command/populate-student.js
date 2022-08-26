const { ddbDocClient } = require("../client");
const { result: tableSchema } = require("../input/table.json");

(async () => {
  const { result: students } = require("../input/student.json");
  const putStudentPromiseList = students.map(
    (student) =>
      new Promise((resolve, reject) => {
        const item = {
          PK: "Student",
          SK: `S.${student.school}.${student.grade}.${student.name}`,
          retired: false,
        };
        item.StudentIndexKey = `${item.PK}.${item.SK}`;
        item.ItemIndexKey = item.SK;

        ddbDocClient
          .put({
            TableName: tableSchema.TableName,
            Item: item,
            ConditionExpression: "#pk <> :pk and #sk <> :sk",
            ExpressionAttributeNames: {
              "#pk": "PK",
              "#sk": "SK",
            },
            ExpressionAttributeValues: {
              ":pk": item.PK,
              ":sk": item.SK,
            },
          })
          .then((value) => resolve(value))
          .catch((err) => reject(err));
      })
  );

  try {
    await Promise.all(putStudentPromiseList);
    console.log("done");
  } catch (err) {
    if (err.name?.includes("ConditionalCheckFailedException"))
      console.log("There's duplicated key already");
    else console.log("Error", err);
  }
})();
