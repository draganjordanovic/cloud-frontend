import { DynamoDBClient, QueryCommand, BatchGetItemCommand } from "@aws-sdk/client-dynamodb";
const db = new DynamoDBClient({ region: "eu-central-1" });

export const handler = async (event) => {
  const limit = Number(event.queryStringParameters?.limit || 20);
  const cursor = event.queryStringParameters?.cursor
    ? JSON.parse(decodeURIComponent(event.queryStringParameters.cursor))
    : undefined;

  const params = {
    TableName: "MusicMetadata",
    IndexName: "albumId-index",
    KeyConditionExpression: "#a = :single",
    ExpressionAttributeNames: { "#a": "albumId" },
    ExpressionAttributeValues: { ":single": { S: "single" } },
    ProjectionExpression: "id, title, artistIds, createdAt, fileType, fileSize, imageKey, albumId, genres, primaryGenre",
    Limit: limit,
    ExclusiveStartKey: cursor
  };

  const { Items = [], LastEvaluatedKey } = await db.send(new QueryCommand(params));

  const allArtistIds = new Set();
  for (const item of Items) {
    if (item.artistIds?.SS) {
      item.artistIds.SS.forEach(id => allArtistIds.add(id));
    }
  }

  const artistNamesMap = {};
  if (allArtistIds.size > 0) {
    const keys = Array.from(allArtistIds).map(id => ({ id: { S: id } }));

    const batchParams = {
      RequestItems: {
        MusicMetadata: {
          Keys: keys,
          ProjectionExpression: "id, #n",
          ExpressionAttributeNames: { "#n": "name" }
        }
      }
    };

    const batchResult = await db.send(new BatchGetItemCommand(batchParams));
    const artists = batchResult.Responses?.MusicMetadata ?? [];
    for (const artist of artists) {
      artistNamesMap[artist.id.S] = artist.name?.S || "Unknown Artist";
    }
  }

  const singles = Items.map(i => ({
    id: i.id.S,
    title: i.title.S,
    artists: i.artistIds?.SS?.map(id => artistNamesMap[id] || id) ?? [],
    createdAt: i.createdAt?.S ?? null,
    fileType: i.fileType?.S ?? "audio/mpeg",
    fileSize: Number(i.fileSize?.N ?? 0),
    imageKey: i.imageKey?.S ?? null,
    albumId: "single",
    genres: i.genres?.SS ?? [],
    primaryGenre: i.primaryGenre?.S ?? null
  }));

  return {
    statusCode: 200,
    headers: { "Access-Control-Allow-Origin": "*" },
    body: JSON.stringify({
      singles,
      nextCursor: LastEvaluatedKey ? encodeURIComponent(JSON.stringify(LastEvaluatedKey)) : null
    })
  };
};
