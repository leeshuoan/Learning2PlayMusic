from aws_cdk import (
    aws_apigatewayv2 as apigw,
    aws_apigatewayv2_integrations as integrations,
    aws_lambda as _lambda,
    aws_dynamodb as dynamodb,
    core,
)

"""
todo: to be completed!
"""
class ChatStack(core.Stack):
    
    def __init__(self, scope: core.Construct, id: str, **kwargs) -> None:
        super().__init__(scope, id, **kwargs)

        # create the WebSocket API
        web_socket_api = apigw.CfnApi(
            self,
            "WebSocketApi",
            protocol_type="WEBSOCKET",
            name="ChatSockets",
            route_selection_expression="$request.body.action",
        )

        # create the Lambda function that will handle WebSocket connections
        ws_lambda = _lambda.Function(
            self,
            "WebSocketHandler",
            runtime=_lambda.Runtime.PYTHON_3_9,
            handler="app.handler",
            code=_lambda.Code.from_asset("my_lambda_function_folder"),
        )

        # create the WebSocket integration for the Lambda function
        ws_integration = integrations.LambdaWebSocketIntegration(handler=ws_lambda)

        # add the default route for the WebSocket API to the Lambda function
        default_route = apigw.CfnRoute(
            self,
            "DefaultRoute",
            api_id=web_socket_api.ref,
            route_key="$default",
            target=f"integrations/{ws_integration.integration_id}",
        )

        # create a table in DynamoDB to store messages
        chat_table = dynamodb.Table(
            self,
            "ChatTable",
            partition_key=dynamodb.Attribute(name="conversationId", type=dynamodb.AttributeType.STRING),
            sort_key=dynamodb.Attribute(name="timestamp", type=dynamodb.AttributeType.STRING),
        )

        # give permission to the Lambda function to access the DynamoDB table
        chat_table.grant_read_write_data(ws_lambda)

        # add environment variables to the Lambda function to access the DynamoDB table
        ws_lambda.add_environment("CHAT_TABLE_NAME", chat_table.table_name)

        # create the deployment for the WebSocket API
        deployment = apigw.CfnDeployment(
            self,
            "Deployment",
            api_id=web_socket_api.ref,
        )

        # create the stage for the WebSocket API
        stage = apigw.CfnStage(
            self,
            "Stage",
            api_id=web_socket_api.ref,
            deployment_id=deployment.ref,
            stage_name="prod",
        )

        # output the WebSocket API URL
        core.CfnOutput(
            self,
            "WebSocketApiUrl",
            value=f"wss://{web_socket_api.attr_id}.execute-api.{self.region}.amazonaws.com/{stage.stage_name}",
        )
