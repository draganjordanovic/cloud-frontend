import { DynamoDBDocumentClient, QueryCommand } from "@aws-sdk/lib-dynamodb";
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
        const result = await dynamo.send(new QueryCommand({
            TableName: process.env.TABLE_NAME,
            IndexName: process.env.GSI_NAME,
            KeyConditionExpression: "artistId = :a",
            ExpressionAttributeValues: { ":a": artistId }
        }));
        console.log("Event:", JSON.stringify(event));
        console.log("ArtistId:", artistId);


        return {
            statusCode: 200,
            headers: { "Access-Control-Allow-Origin": "*" },
            body: JSON.stringify(result.Items || [])
        };
    } catch (err) {
        console.error(err);
        return {
            statusCode: 500,
            headers: { "Access-Control-Allow-Origin": "*" },
            body: JSON.stringify({ error: err.message }) };
    }
};
