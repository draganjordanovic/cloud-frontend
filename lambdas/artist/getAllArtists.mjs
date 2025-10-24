import { DynamoDBClient, QueryCommand } from "@aws-sdk/client-dynamodb";

import { checkRole, getForbiddenResponse } from '/opt/nodejs/roleChecker.mjs';
const client = new DynamoDBClient({ region: "eu-central-1" });

export const handler = async (event, context) => {
  const claims = event.requestContext.authorizer.claims;
  const requiredRoles = ['Admin'];

  if (!checkRole(requiredRoles, claims)) {
    return getForbiddenResponse();
  }

  try {
    const command = new QueryCommand({
      TableName: "MusicMetadata",
      IndexName: "type-index",
      KeyConditionExpression: "#t = :artistType",
      ExpressionAttributeNames: { "#t": "type" },
      ExpressionAttributeValues: { ":artistType": { S: "artist" } },
    });

    const response = await client.send(command);
    const artists = response.Items.map(item => ({
      id: item.id.S,
      name: item.name.S,
      genres: item.genres?.SS || [],
    }));

    return {
      statusCode: 200,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify(artists),
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({ error: err.message }),
    };
  }
};
