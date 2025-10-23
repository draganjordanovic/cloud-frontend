import { DynamoDB } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, QueryCommand } from "@aws-sdk/lib-dynamodb";
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

import { checkRole, getForbiddenResponse } from '/opt/nodejs/roleChecker.mjs';


const client = new DynamoDB({});
const dynamo = DynamoDBDocumentClient.from(client);
const s3 = new S3Client({ region: "eu-central-1" });

const TABLE_NAME = process.env.TABLE_NAME;
const GSI_NAME = process.env.GSI_NAME;
const BUCKET_NAME = process.env.BUCKET_NAME;

export const handler = async (event) => {
    const claims = event.requestContext.authorizer.claims;
    const requiredRoles = ['Regular'];

    if (!checkRole(requiredRoles, claims)) {
        return getForbiddenResponse();
    }

    try {
        const genre = event.queryStringParameters?.genre;
        const type = (event.queryStringParameters?.type || "").toLowerCase();

        if (!genre) return { statusCode: 400, body: JSON.stringify({ error: "Genre is required" }) };

        const queryInput = {
            TableName: TABLE_NAME,
            IndexName: GSI_NAME,
            KeyConditionExpression: "#genre = :g",
            ExpressionAttributeNames: { "#genre": "primaryGenre" },
            ExpressionAttributeValues: { ":g": genre.toUpperCase() },
        };

        if (["album", "artist"].includes(type)) {
            queryInput.KeyConditionExpression += " AND begins_with(#t, :type)";
            queryInput.ExpressionAttributeNames["#t"] = "type";
            queryInput.ExpressionAttributeValues[":type"] = type;
        }

        const result = await dynamo.send(new QueryCommand(queryInput));
        let items = result.Items || [];

        items = items.filter(function(item) {
            return item.type === "album" || item.type === "artist";
        });

        const albumMap = {};
        const artistMap = {};

        items.forEach((item) => {
            if (item.type === "album") albumMap[item.id] = item.title || item.name || "";
            if (item.type === "artist") artistMap[item.id] = item.name || "";
        });

        const getFallback = (type) => {
            switch (type) {
                case "artist": return "fallbacks/artist-fallback.png";
                case "album": return "fallbacks/album-fallback.jpg";
                //case "song": return "fallbacks/song-fallback.png";
                default: return "fallbacks/album-fallback.jpg";
            }
        };

        const out = await Promise.all(
            items.map(async (item) => {
                let artistIds = [];
                if (Array.isArray(item.artistIds)) {
                    artistIds = item.artistIds;
                } else if (item.artistIds && typeof item.artistIds === "object") {
                    if (typeof item.artistIds.values === "function") {
                        artistIds = Array.from(item.artistIds.values());
                    } else {
                        artistIds = Object.values(item.artistIds).filter(v => typeof v === "string");
                    }
                }
                const artistNames = artistIds.map(id => artistMap[id]).filter(Boolean);
                //const albumName = item.albumId ? albumMap[item.albumId] : (item.type === "song" && !item.albumId ? "Single" : undefined);

                let coverUrl = item.cover;
                try {
                    const key = item.imageKey || getFallback(item.type);
                    coverUrl = await getSignedUrl(s3, new GetObjectCommand({ Bucket: BUCKET_NAME, Key: key }), { expiresIn: 300 });
                } catch (err) {
                    console.error("Error generating signed URL for item:", item.id, err);
                    coverUrl = await getSignedUrl(s3, new GetObjectCommand({ Bucket: BUCKET_NAME, Key: getFallback(item.type) }), { expiresIn: 300 });
                }

                return { ...item, artistNames, cover: coverUrl };
            })
        );

        return {
            statusCode: 200,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "Content-Type,Authorization",
                "Access-Control-Allow-Methods": "OPTIONS,GET" },
            body: JSON.stringify({ items: out }),
        };

    } catch (err) {
        console.error("Lambda error:", err);
        return {
            statusCode: 500,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "Content-Type,Authorization",
                "Access-Control-Allow-Methods": "OPTIONS,GET" },
            body: JSON.stringify({ error: err.message }),
        };
    }
};
