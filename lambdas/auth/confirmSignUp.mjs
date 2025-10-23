import { CognitoIdentityProviderClient, ConfirmSignUpCommand } from "@aws-sdk/client-cognito-identity-provider";

const client = new CognitoIdentityProviderClient({ region: "eu-central-1" });

export const handler = async (event) => {
    try {
        const body = JSON.parse(event.body);
        const { username, confirmationCode } = body;

        const params = {
            ClientId: process.env.COGNITO_CLIENT_ID,
            Username: username,
            ConfirmationCode: confirmationCode,
        };

        const command = new ConfirmSignUpCommand(params);
        await client.send(command);

        return {
            statusCode: 200,
            headers: {
                "Access-Control-Allow-Origin": "*",
            },
            body: JSON.stringify({ message: "User confirmed successfully!" }),
        };
    } catch (err) {
        console.error("Confirmation error:", err);
        return {
            statusCode: 400,
            headers: {
                "Access-Control-Allow-Origin": "*",
            },
            body: JSON.stringify({ message: err.message }),
        };
    }
};
