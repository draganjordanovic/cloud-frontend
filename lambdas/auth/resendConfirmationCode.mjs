import { CognitoIdentityProviderClient, ResendConfirmationCodeCommand } from "@aws-sdk/client-cognito-identity-provider";

const client = new CognitoIdentityProviderClient({ region: "eu-central-1" });

export const handler = async (event) => {
    try {
        const body = typeof event.body === "string" ? JSON.parse(event.body) : event.body;
        const { username } = body;

        if (!username) {
            return {
                statusCode: 400,
                headers: {
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Headers": "*",
                },
                body: JSON.stringify({ message: "Username is required." }),
            };
        }

        const command = new ResendConfirmationCodeCommand({
            ClientId: process.env.COGNITO_CLIENT_ID,
            Username: username,
        });

        await client.send(command);

        return {
            statusCode: 200,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "*",
            },
            body: JSON.stringify({ message: "Confirmation code resent successfully." }),
        };
    } catch (err) {
        console.error("Error resending code:", err);

        return {
            statusCode: 500,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "*",
            },
            body: JSON.stringify({ message: "Failed to resend confirmation code.", error: err.message }),
        };
    }
};
