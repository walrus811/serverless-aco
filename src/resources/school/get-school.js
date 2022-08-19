const _ = require("lodash");
const {
  parseQueryParam,
  parseDynamodbKey,
  getId,
} = require("/opt/nodejs/util");
const { PARTIAL_SCHOOL_EXP } = require("/opt/nodejs/projectionExp");
const getSchool = require("/opt/nodejs/getSchool");

exports.handler = async (event) => {
  const queryParam = parseQueryParam(event);
  const lastIdTuple = parseDynamodbKey(queryParam.lastId, "School");

  try {
    const result = await getSchool(
      process.env.AWS_DYNAMODB_TABLE_NAME,
      queryParam.limit,
      lastIdTuple,
      queryParam.ascend,
      queryParam.full,
      PARTIAL_SCHOOL_EXP
    );

    const response = {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
      },
      body: {
        result: _.map(result.Items, function (item) {
          return {
            id: getId(item),
            name: item.SK,
          };
        }),
        lastId: result.LastEvaluatedKey ? getId(result.LastEvaluatedKey) : null,
      },
    };

    console.info(
      `response from: ${event.path} statusCode: ${response.statusCode} body: ${response.body}`
    );

    return response;
  } catch (error) {
    console.error( JSON.stringify( error ) );
  }
};
