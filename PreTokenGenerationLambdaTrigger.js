const AWS = require("aws-sdk");

// Create the DynamoDB service object
var ddb = new AWS.DynamoDB({ apiVersion: "2012-08-10" });

// PretokenGeneration Lambda
exports.handler = async function (event, context) {
    var eventUserName = "";
    var userRole = "";

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
        ProjectionExpression: "UserRole",
        TableName: "UserInfoTable"
    };

    event.response = {
        "claimsOverrideDetails": {
            "claimsToAddOrOverride": {
                "userName": event.userName,
                "userRole": null
            },
        }
    };

    try {
        let result = await ddb.query(params).promise();
        console.log(result)
        if (result.Items.length > 0) {
            console.log(result.Items)
            const userRole = result.Items[0]["UserRole"]["S"];
            console.log("userRole = " + userRole);
            event.response.claimsOverrideDetails.claimsToAddOrOverride.userRole = userRole;
        }
    }
    catch (error) {
        console.log(error);
    }

    return event;
};