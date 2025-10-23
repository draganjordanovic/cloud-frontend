import { CognitoIdentityProviderClient, InitiateAuthCommand } from "@aws-sdk/client-cognito-identity-provider";

const client = new CognitoIdentityProviderClient({ region: "eu-central-1" });

export const handler = async (event) => {
    try {
        const body = typeof event.body === "string" ? JSON.parse(event.body) : event.body;
        const { username, password } = body;

        if (!username || !password) {
            return {
                statusCode: 400,
                headers: { "Access-Control-Allow-Origin": "*" },
                body: JSON.stringify({ message: "Username and password are required." }),
            };
        }

        const params = {
            AuthFlow: "USER_PASSWORD_AUTH",
            ClientId: process.env.COGNITO_CLIENT_ID,
            AuthParameters: {
                USERNAME: username,
                PASSWORD: password,
            },
        };

        const command = new InitiateAuthCommand(params);
        const response = await client.send(command);

        return {
            statusCode: 200,
            headers: { "Access-Control-Allow-Origin": "*" },
            body: JSON.stringify({
                message: "Login successful",
                idToken: response.AuthenticationResult?.IdToken,
                accessToken: response.AuthenticationResult?.AccessToken,
                refreshToken: response.AuthenticationResult?.RefreshToken,
            }),
        };
    } catch (err) {
        console.error("Login error:", err);
        return {
            statusCode: 400,
            headers: { "Access-Control-Allow-Origin": "*" },
            body: JSON.stringify({ message: err.message }),
        };
    }
};
