import { DynamoDBClient, QueryCommand } from "@aws-sdk/client-dynamodb";
import { checkRole, getForbiddenResponse } from '/opt/nodejs/roleChecker.mjs';

const db = new DynamoDBClient({ region: "eu-central-1" });

export const handler = async (event) => {
    const claims = event.requestContext.authorizer.claims;
    const requiredRoles = ['Admin', 'Regular'];

    if (!checkRole(requiredRoles, claims)) {
        return getForbiddenResponse();
    }

    const limit = Number(event.queryStringParameters?.limit || 20);
    const cursor = event.queryStringParameters?.cursor
        ? JSON.parse(decodeURIComponent(event.queryStringParameters.cursor))
        : undefined;

    const params = {
        TableName: "MusicMetadata",
        IndexName: "type-index",
        KeyConditionExpression: "#t = :album",
        ExpressionAttributeNames: { "#t": "type" },
        ExpressionAttributeValues: { ":album": { S: "album" } },
        ProjectionExpression: "id, title, artistIds, releaseYear, songCount, primaryGenre, createdAt",
        Limit: limit,
        ExclusiveStartKey: cursor
    };

    const { Items = [], LastEvaluatedKey } = await db.send(new QueryCommand(params));
    const albums = Items.map(i => ({
        id: i.id.S,
        title: i.title.S,
        artistIds: i.artistIds?.SS ?? [],
        releaseYear: Number(i.releaseYear?.N ?? new Date().getFullYear()),
        songCount: Number(i.songCount?.N ?? 0),
        primaryGenre: i.primaryGenre?.S ?? null,
        createdAt: i.createdAt?.S ?? null
    }));

    return {
        statusCode: 200,
        headers: { "Access-Control-Allow-Origin": "*" },
        body: JSON.stringify({
            albums,
            nextCursor: LastEvaluatedKey ? encodeURIComponent(JSON.stringify(LastEvaluatedKey)) : null
        })
    };
};
