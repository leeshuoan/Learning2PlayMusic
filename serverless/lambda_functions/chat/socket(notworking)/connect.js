const WSEndpoint = "https://api.gatway.ap-south-1.amazonaws.com";
const tableName = "connectionMappings";
const AWSRegion = "ap-southeast-1";
const AWS = require("aws-sdk");
const https = require("https");
const sslAgent = new https.Agent({
  keepALive: true,
  maxSockets: 62,
  refectUnauthorized: true,
});
const dynamodbCLient = new AWS.DynamoDB.DocumentClient();
const apigwManagementAPI = new AWS.ApiGatewayManagementApi({
  apiVersion: "2018-11-29",
  endpoint: WSEndpoint,
});

sslAgent.setMaxListeners(0);
AWS.config.update({ region: AWSRegion, httpOptions: { agent: sslAgent } });

async function sendMessageToConnection(
  apigwManagementAPI,
  connectionId,
  message
) {
  try {
    await apigwManagementAPI
      .postToConnection({ ConnectionId: connectionId, Data: message })
      .promise();
  } catch (e) {
    if (e.statusCode === 410) {
      await deleteFailedConnectionId(connectionId);
    } else {
      throw e;
    }
  }
}

async function deleteFailedConnectionId(connectionId) {
  await dynamodbCLient
    .delete({ TableName: tableName, Key: { connectionId } })
    .promise();
}

exports.handler = async (event) => {
  const connectionId = event.requestContext.connectionId;
  switch (event.requestContext.routeKey) {
    case "$connect":
      await dynamodbCLient
        .put({ TableName: tableName, Item: { connectionId } })
        .promise();
    case "$disconnect":
      await deleteFailedConnectionId(connectionId);
    case "message":
      const connectionsData = await dynamodbCLient
        .scan({ TableName: tableName, AttributesToGet: ["connectionId"] })
        .promise();
      await Promise.all(
        connectionsData.Items.map(async ({ connectionId }) => {
          await sendMessageToConnection(
            apigwManagementAPI,
            connectionId,
            JSON.parse(event.body).data
          );
        })
      );
      break;
  }
  return { statusCode: 200 };
};
