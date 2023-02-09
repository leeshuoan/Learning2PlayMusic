const AWS = require("aws-sdk");

// Create the DynamoDB service object
var ddb = new AWS.DynamoDB({ apiVersion: "2012-08-10" });

// PretokenGeneration Lambda
exports.handler = async function (event, context) {
    if (!event.userName) {
        return event;
    }

    var params = {
        ExpressionAttributeValues: {
            ":v1": {
                S: event.userName
            }
        },
        KeyConditionExpression: "UserName = :v1",
        ProjectionExpression: "UserRole, UserAlias",
        TableName: "UserInfoTable"
    };

    event.response = {
        "claimsOverrideDetails": {
            "claimsToAddOrOverride": {
                "userName": event.userName,
                "userRole": null,
                "name": null
            },
        }
    };

    try {
        let result = await ddb.query(params).promise();
        if (result.Items.length > 0) {
            const userRole = result.Items[0]["UserRole"]["S"];
            const name = result.Items[0]["UserAlias"]["S"];
            event.response.claimsOverrideDetails.claimsToAddOrOverride.userRole = userRole;
            event.response.claimsOverrideDetails.claimsToAddOrOverride.name = name;
        }
    }
    catch (error) {
        console.log(error);
    }

    return event;
};