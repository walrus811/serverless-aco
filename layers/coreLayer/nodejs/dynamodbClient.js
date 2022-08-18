const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocument } = require("@aws-sdk/lib-dynamodb");

const {
  AWS_REGION,
  AWS_DYNAMODB_END_POINT,
  AWS_ACCESSKEY_ID,
  AWS_SECRET_ACCESS_KEY,
} = process.env;

const ddbClient = new DynamoDBClient({
  region: AWS_REGION,
  endpoint: AWS_DYNAMODB_END_POINT,
  credentials: {
    accessKeyId: AWS_ACCESSKEY_ID,
    secretAccessKey: AWS_SECRET_ACCESS_KEY,
  },
});

const ddbDocClient = DynamoDBDocument.from(ddbClient);

exports.ddbClient = ddbClient;
exports.ddbDocClient = ddbDocClient;
