import { DynamoDBClient, GetItemCommand } from "@aws-sdk/client-dynamodb";
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { checkRole, getForbiddenResponse } from '/opt/nodejs/roleChecker.mjs';

const db = new DynamoDBClient({ region: "eu-central-1" });
const s3 = new S3Client({ region: "eu-central-1" });
const BUCKET = "music-content-bucket";

export const handler = async (event) => {
    const claims = event.requestContext.authorizer.claims;
    const requiredRoles = ['Admin', 'Regular'];

    if (!checkRole(requiredRoles, claims)) {
        return getForbiddenResponse();
    }

    const id = event.pathParameters.id;

    const { Item } = await db.send(new GetItemCommand({
        TableName: "MusicMetadata",
        Key: { id: { S: id } }
    }));

    if (!Item || Item.type?.S !== "song") {
        return { statusCode: 404, headers: { "Access-Control-Allow-Origin": "*" }, body: JSON.stringify({ error: "Song not found" }) };
    }

    const key = Item.s3Key.S;
    const cmd = new GetObjectCommand({ Bucket: BUCKET, Key: key, ResponseContentType: Item.fileType.S });
    const url = await getSignedUrl(s3, cmd, { expiresIn: 900 });

    return {
        statusCode: 200,
        headers: { "Access-Control-Allow-Origin": "*" },
        body: JSON.stringify({ streamUrl: url })
    };
};
