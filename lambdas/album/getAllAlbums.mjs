import { DynamoDBClient, ScanCommand } from "@aws-sdk/client-dynamodb";

const dynamo = new DynamoDBClient({ region: "eu-central-1" });
const TABLE_NAME = "MusicMetadata";

export const handler = async () => {
  try {
    const cmd = new ScanCommand({
      TableName: TABLE_NAME,
      FilterExpression: "#type = :album",
      ExpressionAttributeNames: { "#type": "type" },
      ExpressionAttributeValues: { ":album": { S: "album" } },
      ProjectionExpression: "id, title"
    });

    const { Items = [], LastEvaluatedKey } = await dynamo.send(cmd);

    const albums = Items.map(item => ({
      id: item.id?.S,
      title: item.title?.S ?? null
    }));

    return {
      statusCode: 200,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({
        albums,
        lastKey: LastEvaluatedKey ?? null
      })
    };
  } catch (err) {
    console.error("Error fetching albums:", err);
    return {
      statusCode: 500,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({ error: err.message })
    };
  }
};