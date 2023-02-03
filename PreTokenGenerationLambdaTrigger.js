const AWS = require("aws-sdk");

// Create the DynamoDB service object
var ddb = new AWS.DynamoDB({ apiVersion: "2012-08-10" });

// PretokenGeneration Lambda
exports.handler = async function (event, context) {
    var eventUserName = "";
    var role = "";

    if (!event.userName) {
        return event;
    }

    var params = {
        ExpressionAttributeValues: {
            ":v1": {
                S: event.userName
            }
        },
        KeyConditionExpression: "userName = :v1",
        ProjectionExpression: "Role",
        TableName: "UserInfoTable"
    };

    event.response = {
        "claimsOverrideDetails": {
            "claimsToAddOrOverride": {
                "userName": event.userName,
                "role": null
            },
        }
    };

    try {
        let result = await ddb.query(params).promise();
        if (result.Items.length > 0) {
            const role = result.Items[0]["Role"];
            console.log("role = " + role);
            event.response.claimsOverrideDetails.claimsToAddOrOverride.role = role;
        }
    }
    catch (error) {
        console.log(error);
    }

    return event;
};