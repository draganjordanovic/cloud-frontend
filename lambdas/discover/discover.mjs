import { DynamoDB } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, QueryCommand } from "@aws-sdk/lib-dynamodb";
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { checkRole, getForbiddenResponse } from "/opt/nodejs/roleChecker.mjs";

const client = new DynamoDB({});
const dynamo = DynamoDBDocumentClient.from(client);
const s3 = new S3Client({ region: "eu-central-1" });

const TABLE_NAME = process.env.TABLE_NAME;
const GSI_NAME = process.env.GSI_NAME;
const BUCKET_NAME = process.env.BUCKET_NAME;

const imageCache = new Map();
let fallbackCache = {};

const getFallbackKey = (type) => {
    switch (type) {
        case "artist": return "fallbacks/artist-fallback.png";
        case "album": return "fallbacks/album-fallback.jpg";
        default: return "fallbacks/album-fallback.jpg";
    }
};

const getSignedUrlCached = async (key) => {
    if (imageCache.has(key)) return imageCache.get(key);

    const url = await getSignedUrl(
        s3,
        new GetObjectCommand({ Bucket: BUCKET_NAME, Key: key }),
        { expiresIn: 600 }
    );

    imageCache.set(key, url);
    return url;
};

export const handler = async (event) => {
    const claims = event.requestContext.authorizer.claims;
    const requiredRoles = ["Regular"];

    if (!checkRole(requiredRoles, claims)) return getForbiddenResponse();

    try {
        const genre = event.queryStringParameters?.genre;
        const type = (event.queryStringParameters?.type || "").toLowerCase();

        if (!genre)
            return { statusCode: 400, body: JSON.stringify({ error: "Genre is required" }) };

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

        items = items.filter((item) => item.type === "album" || item.type === "artist");
        const albumMap = {};
        const artistMap = {};

        for (const item of items) {
            if (item.type === "album") albumMap[item.id] = item.title || item.name || "";
            if (item.type === "artist") artistMap[item.id] = item.name || "";
        }

        if (Object.keys(fallbackCache).length === 0) {
            fallbackCache = {
                artist: await getSignedUrlCached(getFallbackKey("artist")),
                album: await getSignedUrlCached(getFallbackKey("album")),
            };
        }

        const out = await Promise.all(
            items.map(async (item) => {
                let artistIds = [];
                if (Array.isArray(item.artistIds)) {
                    artistIds = item.artistIds;
                } else if (item.artistIds && typeof item.artistIds === "object") {
                    if (typeof item.artistIds.values === "function") {
                        artistIds = Array.from(item.artistIds.values());
                    } else {
                        artistIds = Object.values(item.artistIds).filter((v) => typeof v === "string");
                    }
                }

                const artistNames = artistIds.map((id) => artistMap[id]).filter(Boolean);

                let coverUrl;
                const key = item.imageKey || getFallbackKey(item.type);

                try {
                    coverUrl = await getSignedUrlCached(key);
                } catch (err) {
                    console.error("Error getting image for item:", item.id, err);
                    coverUrl = fallbackCache[item.type] || fallbackCache.album;
                }

                return { ...item, artistNames, cover: coverUrl };
            })
        );

        return {
            statusCode: 200,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "Content-Type,Authorization",
                "Access-Control-Allow-Methods": "OPTIONS,GET",
            },
            body: JSON.stringify({ items: out }),
        };
    } catch (err) {
        console.error("Lambda error:", err);
        return {
            statusCode: 500,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "Content-Type,Authorization",
                "Access-Control-Allow-Methods": "OPTIONS,GET",
            },
            body: JSON.stringify({ error: err.message }),
        };
    }
};
