const { ddbDocClient } = require("../client");
const { result: tableSchema } = require("../input/table.json");
const _ = require("lodash");

(async () => {
  const { result: students } = require("../input/student.json");
  const curriedRightMapBySchool = _.curryRight(_.map);
  const schools = _.flow([curriedRightMapBySchool("school"), _.uniq])(students);
  const putSchoolPromiseList = _.map(schools, function (school) {
    return new Promise((resolve, reject) => {
      const item = {
        PK: "School",
        SK: school,
      };

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
    });
  });

  try {
    await Promise.all(putSchoolPromiseList);
    console.log("done");
  } catch (err) {
    if (err.name?.includes("ConditionalCheckFailedException"))
      console.log("There's duplicated key already");
    else console.log("Error", err);
  }
})();
