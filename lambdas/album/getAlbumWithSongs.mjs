import { DynamoDBClient, GetItemCommand, QueryCommand } from "@aws-sdk/client-dynamodb";
const db = new DynamoDBClient({ region: "eu-central-1" });

export const handler = async (event) => {
  const albumId = event.pathParameters.id;
  const limit = Number(event.queryStringParameters?.limit || 50);
  const cursor = event.queryStringParameters?.cursor
    ? JSON.parse(decodeURIComponent(event.queryStringParameters.cursor))
    : undefined;

  const { Item: album } = await db.send(new GetItemCommand({
    TableName: "MusicMetadata",
    Key: { id: { S: albumId } }
  }));

  if (!album || album.type?.S !== "album") {
    return { statusCode: 404, headers: { "Access-Control-Allow-Origin": "*" }, body: JSON.stringify({ error: "Album not found" }) };
  }

  const albumDto = {
    id: album.id.S,
    title: album.title.S,
    artistIds: album.artistIds?.SS ?? [],
    releaseYear: Number(album.releaseYear?.N ?? 0),
    description: album.description?.S ?? "",
    genres: album.genres?.SS ?? [],
    primaryGenre: album.primaryGenre?.S ?? null,
    songCount: Number(album.songCount?.N ?? 0),
    createdAt: album.createdAt?.S ?? null
  };

  const params = {
    TableName: "MusicMetadata",
    IndexName: "albumId-index",
    KeyConditionExpression: "#a = :aid",
    ExpressionAttributeNames: { "#a": "albumId" },
    ExpressionAttributeValues: { ":aid": { S: albumId } },
    ProjectionExpression: "id, title, artistIds, createdAt, fileType, fileSize, imageKey, albumId, genres, primaryGenre",
    Limit: limit,
    ExclusiveStartKey: cursor
  };

  const { Items = [], LastEvaluatedKey } = await db.send(new QueryCommand(params));
  const songs = Items.map(i => ({
    id: i.id.S,
    title: i.title.S,
    artistIds: i.artistIds?.SS ?? [],
    albumId: i.albumId?.S ?? albumId,
    createdAt: i.createdAt?.S ?? null,
    fileType: i.fileType?.S ?? "audio/mpeg",
    fileSize: Number(i.fileSize?.N ?? 0),
    imageKey: i.imageKey?.S ?? null,
    genres: i.genres?.SS ?? [],
    primaryGenre: i.primaryGenre?.S ?? null
  }));

  return {
    statusCode: 200,
    headers: { "Access-Control-Allow-Origin": "*" },
    body: JSON.stringify({
      album: albumDto,
      songs,
      nextCursor: LastEvaluatedKey ? encodeURIComponent(JSON.stringify(LastEvaluatedKey)) : null
    })
  };
};
