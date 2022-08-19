function parseQueryParam(event) {
  if (!event.queryStringParameters) return {};

  const limitValue = parseInt(event.queryStringParameters.limit);
  return {
    limit: limitValue > 0 ? limitValue : undefined,
    lastId: decodeURIComponent(event.queryStringParameters.lastId),
    ascend: event.queryStringParameters?.ascend === "true",
    full: event.queryStringParameters.full === "true",
  };
}

function parseDynamodbKey(keyString, defaultPK, sep = "|") {
  const failedReturnValue = [defaultPK, null];
  if (!keyString || !defaultPK) return failedReturnValue;

  const firstSepIndex = keyString.indexOf(sep);
  if (firstSepIndex === -1) return failedReturnValue;

  const fromPK = keyString.substring(0, firstSepIndex);
  const sk = keyString.substring(firstSepIndex + 1);

  if (defaultPK !== fromPK) return failedReturnValue;

  return [fromPK, sk];
}

function getId(item, sep = "|") {
  if (!item) return undefined;

  const { PK, SK } = item;
  return `${PK}${sep}${SK}`;
}


exports.parseQueryParam = parseQueryParam;
exports.parseDynamodbKey = parseDynamodbKey;
exports.getId = getId;
