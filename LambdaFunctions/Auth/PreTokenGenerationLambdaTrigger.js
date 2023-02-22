const AWS = require("aws-sdk");

// Create the CognitoIdentity service object
const cognitoIdentityServiceProvider = new AWS.CognitoIdentityServiceProvider();

// PretokenGeneration Lambda
exports.handler = async function (event, context) {
    if (!event.userName) {
        return event;
    }

    event.response = {
        "claimsOverrideDetails": {
            "claimsToAddOrOverride": {
                "userName": event.userName,
                "userRole": null,
            },
        }
    };

    try {
        const userPoolId = 'ap-southeast-1_llGKQDogf';

        // Define the params for the adminGetUser method
        const params = {
            UserPoolId: userPoolId,
            Username: event.userName
        };

        cognitoIdentityServiceProvider.adminGetUser(params).promise()
            .then(data => {
                // Perform actions on the resulting data
                const customAttributes = data.UserAttributes.filter(attr => attr.Name.startsWith('custom:'));

                // Print the user's custom attributes
                customAttributes.forEach(attr => {
                    console.log(attr.Name.substring(7), attr.Value);
                    if (attr.Name.substring(7) == 'role') {
                        console.log(attr.Value)
                        event.response.claimsOverrideDetails.claimsToAddOrOverride.userRole = attr.Value;
                    }
                });
            })
            .catch(error => {
                // Handle any errors
                console.log(error);
            });
    }
    catch (error) {
        console.log(error);
    }

    return event;
};