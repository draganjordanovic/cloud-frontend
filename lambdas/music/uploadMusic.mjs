import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const region = "eu-central-1";
const s3 = new S3Client({ region });
const dynamo = new DynamoDBClient({ region });
const BUCKET = "music-content-bucket";

export const handler = async (event) => {
  try {
    const body = JSON.parse(event.body);

    const songId = `song-${crypto.randomUUID()}`;
    const fileName = body.fileName;
    const fileType = body.fileType || "audio/mpeg";
    const fileSize = body.fileSize || 0;
    const createdAt = new Date().toISOString();
    const lastModified = createdAt;

    const title = body.title || fileName;
    const genres = body.genres || [];
    const description = body.description || "";
    const artistIds = body.artistIds || [];
    const albumId = body.albumId || "single";

    const imageFileName = body.imageFileName;
    const imageFileType = body.imageFileType || "image/jpeg";

    const songKey = `${songId}-${fileName}`;
    const songCommand = new PutObjectCommand({
      Bucket: BUCKET,
      Key: songKey,
      ContentType: fileType
    });
    const uploadUrl = await getSignedUrl(s3, songCommand, { expiresIn: 3600 });

    let imageUploadUrl = null;
    let imageKey = null;
    if (imageFileName) {
      imageKey = `${songId}-${imageFileName}`;
      const imageCommand = new PutObjectCommand({
        Bucket: BUCKET,
        Key: imageKey,
        ContentType: imageFileType
      });
      imageUploadUrl = await getSignedUrl(s3, imageCommand, { expiresIn: 3600 });
    }

    const primaryGenre = genres.length > 0 ? genres[0] : "UNKNOWN";

    const item = {
      id: { S: songId },
      type: { S: "song" },
      title: { S: title },
      fileName: { S: fileName },
      fileType: { S: fileType },
      fileSize: { N: fileSize.toString() },
      createdAt: { S: createdAt },
      lastModified: { S: lastModified },
      s3Key: { S: songKey },
      artistIds: { SS: artistIds },
      primaryGenre: { S: primaryGenre },
      genres: { SS: genres },
      description: { S: description },
      albumId: { S: albumId }
    };

    if (imageKey) {
      item.imageKey = { S: imageKey };
    }

    const dbCmd = new PutItemCommand({
      TableName: "MusicMetadata",
      Item: item
    });
    await dynamo.send(dbCmd);

    return {
      statusCode: 200,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({
        message: "Upload URL(s) generated successfully",
        songId,
        uploadUrl,
        imageUploadUrl 
      })
    };

  } catch (err) {
    return {
      statusCode: 500,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({ error: err.message })
    };
  }
};