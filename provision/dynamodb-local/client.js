const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocument } = require("@aws-sdk/lib-dynamodb");

const {
  AWS_REGION,
  LOCAL_DYNAMODB_END_POINT,
  LOCAL_ACCESSKEY_ID,
  LOCAL_SECRET_ACCESS_KEY,
} = require("../../env.json").Parameters;

const ddbClient = new DynamoDBClient({
  region: AWS_REGION,
  endpoint: LOCAL_DYNAMODB_END_POINT,
  credentials: {
    accessKeyId: LOCAL_ACCESSKEY_ID,
    secretAccessKey: LOCAL_SECRET_ACCESS_KEY,
  },
});

const ddbDocClient = DynamoDBDocument.from(ddbClient);

exports.ddbClient = ddbClient;
exports.ddbDocClient = ddbDocClient;
