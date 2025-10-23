import {
    CognitoIdentityProviderClient,
    SignUpCommand,
    AdminAddUserToGroupCommand
} from "@aws-sdk/client-cognito-identity-provider";

const client = new CognitoIdentityProviderClient({ region: "eu-central-1" });

export const handler = async (event) => {
    try {
        const body = JSON.parse(event.body);
        const { username, password, email, givenName, familyName, dob } = body;

        const signUpParams = {
            ClientId: process.env.COGNITO_CLIENT_ID,
            Username: username,
            Password: password,
            UserAttributes: [
                { Name: "email", Value: email },
                { Name: "given_name", Value: givenName },
                { Name: "family_name", Value: familyName },
                { Name: "birthdate", Value: dob },
            ],
        };

        const signUpResponse = await client.send(new SignUpCommand(signUpParams));

        const addToGroupParams = {
            UserPoolId: process.env.COGNITO_USER_POOL_ID,
            Username: username,
            GroupName: "Regular",
        };

        await client.send(new AdminAddUserToGroupCommand(addToGroupParams));

        return {
            statusCode: 200,
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "Content-Type",
                "Access-Control-Allow-Methods": "OPTIONS,POST"
            },
            body: JSON.stringify({
                message: "User registered and added to 'Regular' group successfully.",
                userConfirmed: signUpResponse.UserConfirmed,
            }),
        };

    } catch (err) {
        console.error("Signup error:", err);
        return {
            statusCode: 400,
            headers: {
                "Access-Control-Allow-Origin": "*",
            },
            body: JSON.stringify({ message: err.message }),
        };
    }
};
