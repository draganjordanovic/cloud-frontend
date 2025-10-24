import { DynamoDBDocumentClient, QueryCommand, GetCommand } from "@aws-sdk/lib-dynamodb";
import { DynamoDB } from "@aws-sdk/client-dynamodb";
import { checkRole, getForbiddenResponse } from '/opt/nodejs/roleChecker.mjs';

const client = new DynamoDB({});
const dynamo = DynamoDBDocumentClient.from(client);

export const handler = async (event) => {
    const claims = event.requestContext.authorizer.claims;
    const requiredRoles = ['Admin', 'Regular'];

    if (!checkRole(requiredRoles, claims)) {
        return getForbiddenResponse();
    }

    const artistId = event.pathParameters?.id;
    if (!artistId) {
        return { statusCode: 400, body: JSON.stringify({ error: "artistId required" }) };
    }

    try {
        const albumsResult = await dynamo.send(new QueryCommand({
            TableName: process.env.TABLE_NAME,
            IndexName: process.env.GSI_NAME,
            KeyConditionExpression: "#t = :albumType",
            FilterExpression: "contains(artistIds, :aid)",
            ExpressionAttributeNames: { "#t": "type" },
            ExpressionAttributeValues: {
                ":albumType": "album",
                ":aid": artistId
            },
            ProjectionExpression: "id, title, releaseYear, genres, description, artistIds"
        }));

        const albums = albumsResult.Items || [];

        const artistRecord = await dynamo.send(new GetCommand({
            TableName: process.env.TABLE_NAME,
            Key: { id: artistId },
            ProjectionExpression: "#n, bio",
            ExpressionAttributeNames: { "#n": "name" }
        }));

        const artistName = artistRecord.Item?.name || 'Unknown Artist';
        const artistBio = artistRecord.Item?.bio || '';

        return {
            statusCode: 200,
            headers: { "Access-Control-Allow-Origin": "*" },
            body: JSON.stringify({ albums, artistName, artistBio })
        };
    } catch (err) {
        console.error(err);
        return {
            statusCode: 500,
            headers: { "Access-Control-Allow-Origin": "*" },
            body: JSON.stringify({ error: err.message })
        };
    }
};
