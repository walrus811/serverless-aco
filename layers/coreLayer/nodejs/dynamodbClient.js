const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocument } = require("@aws-sdk/lib-dynamodb");

const {
  AWS_REGION,
  AWS_DYNAMODB_END_POINT,
  AWS_ACCESSKEY_ID,
  AWS_SECRET_ACCESS_KEY,
} = process.env;

if (!AWS_REGION) console.warn("There's no AWS_REGION in env.");
if (!AWS_DYNAMODB_END_POINT)
  console.warn("There's no AWS_DYNAMODB_END_POINT in env.");
if (!AWS_ACCESSKEY_ID) console.warn("There's no AWS_ACCESSKEY_ID in env.");
if (!AWS_SECRET_ACCESS_KEY)
  console.warn("There's no AWS_SECRET_ACCESS_KEY in env.");

const ddbClient = new DynamoDBClient({
  region: AWS_REGION,
  endpoint: AWS_DYNAMODB_END_POINT,
  credentials: {
    accessKeyId: AWS_ACCESSKEY_ID ?? "",
    secretAccessKey: AWS_SECRET_ACCESS_KEY ?? "",
  },
});

const ddbDocClient = DynamoDBDocument.from(ddbClient);

exports.ddbClient = ddbClient;
exports.ddbDocClient = ddbDocClient;
