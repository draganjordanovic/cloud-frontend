import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";


import { checkRole, getForbiddenResponse } from '/opt/nodejs/roleChecker.mjs';

const client = new DynamoDBClient({ region: "eu-central-1" });

export const handler = async (event) => {
  const claims = event.requestContext.authorizer.claims;
  const requiredRoles = ['Admin'];

  if (!checkRole(requiredRoles, claims)) {
    return getForbiddenResponse();
  }

  try {
    const body = JSON.parse(event.body);

    const genres = body.genres || [];
    const primaryGenre = genres.length > 0 ? genres[0] : "UNKNOWN";

    const artist = {
      id: { S: `artist-${crypto.randomUUID()}` },
      type: { S: "artist" },
      name: { S: body.name },
      bio: { S: body.bio },
      genres: { SS: body.genres },
      primaryGenre: { S: primaryGenre }
    };

    const command = new PutItemCommand({
      TableName: "MusicMetadata",
      Item: artist,
    });

    await client.send(command);

    return {
      statusCode: 201,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({
        message: "Artist created successfully",
        artist,
      }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({ error: error.message }),
    };
  }
};
