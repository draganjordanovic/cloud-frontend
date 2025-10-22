import { DynamoDBClient, ScanCommand } from "@aws-sdk/client-dynamodb";

const client = new DynamoDBClient({ region: "eu-central-1" });

export const handler = async () => {
  try {
    const command = new ScanCommand({
      TableName: "MusicMetadata",
      FilterExpression: "#t = :artistType",
      ExpressionAttributeNames: { "#t": "type" },
      ExpressionAttributeValues: { ":artistType": { S: "artist" } },
    });

    const response = await client.send(command);
    const artists = response.Items.map(item => ({
      id: item.id.S,
      name: item.name.S,
      genres: item.genres?.SS || [],
    }));

    return {
      statusCode: 200,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify(artists),
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({ error: err.message }),
    };
  }
};