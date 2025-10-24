import { DynamoDBClient, QueryCommand } from "@aws-sdk/client-dynamodb";

import { checkRole, getForbiddenResponse } from '/opt/nodejs/roleChecker.mjs';


const dynamo = new DynamoDBClient({ region: "eu-central-1" });
const TABLE_NAME = "MusicMetadata";

export const handler = async (event, context) => {
  const claims = event.requestContext.authorizer.claims;
  const requiredRoles = ['Admin'];

  if (!checkRole(requiredRoles, claims)) {
    return getForbiddenResponse();
  }

  try {
    const cmd = new QueryCommand({
      TableName: TABLE_NAME,
      IndexName: "type-index",
      KeyConditionExpression: "#t = :albumType",
      ExpressionAttributeNames: { "#t": "type" },
      ExpressionAttributeValues: { ":albumType": { S: "album" } },
      ProjectionExpression: "id, title"
    });

    const { Items = [], LastEvaluatedKey } = await dynamo.send(cmd);

    const albums = Items.map(item => ({
      id: item.id?.S,
      title: item.title?.S ?? null
    }));

    return {
      statusCode: 200,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({
        albums,
        lastKey: LastEvaluatedKey ?? null
      })
    };
  } catch (err) {
    console.error("Error fetching albums:", err);
    return {
      statusCode: 500,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({ error: err.message })
    };
  }
};
