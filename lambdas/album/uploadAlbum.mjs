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

    const albumId = `album-${crypto.randomUUID()}`;
    const albumTitle = body.albumTitle || "Untitled Album";
    const artistIds = body.artistIds || [];
    const description = body.description || "";
    const releaseYear = body.releaseYear || new Date().getFullYear();
    const songs = body.songs || [];

    if (songs.length === 0) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "No songs provided in request" })
      };
    }

    const results = [];

    for (const song of songs) {
      const songId = `song-${crypto.randomUUID()}`;
      const fileName = song.fileName;
      const fileType = song.fileType || "audio/mpeg";
      const fileSize = song.fileSize || 0;
      const createdAt = new Date().toISOString();
      const lastModified = createdAt;
      const title = song.title || fileName;
      const genres = song.genres || [];
      const description = song.description || "";

      const key = `${songId}-${fileName}`;
      const putCommand = new PutObjectCommand({
        Bucket: BUCKET,
        Key: key,
        ContentType: fileType
      });
      const uploadUrl = await getSignedUrl(s3, putCommand, { expiresIn: 3600 });

      const item = {
        id: { S: songId },
        type: { S: "song" },
        albumId: { S: albumId },
        title: { S: title },
        fileName: { S: fileName },
        fileType: { S: fileType },
        fileSize: { N: fileSize.toString() },
        createdAt: { S: createdAt },
        lastModified: { S: lastModified },
        s3Key: { S: key },
        description: { S: description },
        artistIds: { SS: artistIds },
        genres: { SS: genres }
      };

      const dbCmd = new PutItemCommand({
        TableName: "MusicMetadata",
        Item: item
      });
      await dynamo.send(dbCmd);

      results.push({
        songId,
        fileName,
        uploadUrl
      });
    }

    const genres = body.genres || [];
    const primaryGenre = genres.length > 0 ? genres[0] : "UNKNOWN";

    const albumItem = {
      id: { S: albumId },
      type: { S: "album" },
      title: { S: albumTitle },
      artistIds: { SS: artistIds },
      releaseYear: { N: releaseYear.toString() },
      description: { S: description },
      songCount: { N: songs.length.toString() },
      createdAt: { S: new Date().toISOString() },
      genres: { SS: genres },
      primaryGenre: { S: primaryGenre }
    };

    const albumCmd = new PutItemCommand({
      TableName: "MusicMetadata",
      Item: albumItem
    });
    await dynamo.send(albumCmd);

    return {
      statusCode: 200,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({
        message: "Album and song upload URLs generated successfully",
        albumId,
        albumTitle,
        songs: results
      })
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({ error: error.message })
    };
  }
};