import boto3
from aws_cdk import core
from aws_cdk import aws_iam
from aws_cdk import aws_lambda as _lambda
from aws_cdk import aws_apigateway as apigateway
from aws_cdk import CfnOutput

class ChatStack(core.Stack):
    def __init__(self, scope: core.Construct, id: str, **kwargs) -> None:
        super().__init__(scope, id, **kwargs)

        FUNCTIONS_FOLDER = "./lambda_functions/"
        CHAT_FUNCTIONS_FOLDER = "chat"

        # Get existing iam role (lambda-general-role) ============================================================
        iam = boto3.client("iam")
        role = iam.get_role(RoleName="lambda-general-role")
        role_arn = role["Role"]["Arn"]
        LAMBDA_ROLE = aws_iam.Role.from_role_arn(
            self, "lambda-general-role", role_arn)

        # create a Lambda function  ============================================================
        get_contacts = _lambda.Function(self, "getContacts", runtime=_lambda.Runtime.PYTHON_3_9, handler=f"{CHAT_FUNCTIONS_FOLDER}.getContacts.lambda_handler", code=_lambda.Code.from_asset(FUNCTIONS_FOLDER), role=LAMBDA_ROLE)
        getConversations = _lambda.Function(self, "getConversations", runtime=_lambda.Runtime.PYTHON_3_9, handler=f"{CHAT_FUNCTIONS_FOLDER}.getConversations.lambda_handler", code=_lambda.Code.from_asset(FUNCTIONS_FOLDER), role=LAMBDA_ROLE)
        readConversation = _lambda.Function(self, "readConversation", runtime=_lambda.Runtime.PYTHON_3_9, handler=f"{CHAT_FUNCTIONS_FOLDER}.readConversation.lambda_handler", code=_lambda.Code.from_asset(FUNCTIONS_FOLDER), role=LAMBDA_ROLE)
        sendMessage = _lambda.Function(self, "sendMessage", runtime=_lambda.Runtime.PYTHON_3_9, handler=f"{CHAT_FUNCTIONS_FOLDER}.sendMessage.lambda_handler", code=_lambda.Code.from_asset(FUNCTIONS_FOLDER), role=LAMBDA_ROLE)

        # create an API Gateway REST API ==========================================================================================
        rest_api = apigateway.RestApi(self, "Chat", description="chat APIs")

        # create a resource and method for /chat/getContacts
        contacts_resource = rest_api.root.add_resource("chat").add_resource("getContacts")
        contacts_method = contacts_resource.add_method("GET", apigateway.LambdaIntegration(get_contacts),
                                                       request_parameters={
                                                           'method.request.querystring.userId': True
                                                       })
        # create a resource and method for /chat/getConversations
        conversations_resource = rest_api.root.add_resource("chat").add_resource("getConversations")
        conversations_method = conversations_resource.add_method("GET", apigateway.LambdaIntegration(getConversations),
                                                                  request_parameters={
                                                                      'method.request.querystring.userId': True
                                                                  })
        # create a resource and method for /chat/readConversation
        read_resource = rest_api.root.add_resource("chat").add_resource("readConversation")
        read_method = read_resource.add_method("GET", apigateway.LambdaIntegration(readConversation),
                                                request_parameters={
                                                    'method.request.querystring.conversationId': True
                                                })

        # create a resource and method for /chat/sendMessage
        send_message_resource = rest_api.root.add_resource("chat").add_resource("sendMessage")
        send_message_method = send_message_resource.add_method("POST", apigateway.LambdaIntegration(handler))

        # add a request validator to the GET methods
        for method in [contacts_method, conversations_method, read_method]:
            method.request_validator = apigateway.RequestValidator(
                self, "myRequestValidator",
                validate_request_parameters=True
            )

        # Enable CORS for each resource/sub-resource etc.
        contacts_resource.add_cors_preflight(
            allow_origins=["*"], allow_methods=["GET", "POST", "DELETE"], status_code=200)
        conversations_method.add_cors_preflight(
            allow_origins=["*"], allow_methods=["GET", "PUT", "DELETE"], status_code=200)
        read_resource.add_cors_preflight(
            allow_origins=["*"], allow_methods=["GET", "PUT", "DELETE"], status_code=200)
        send_message_resource.add_cors_preflight(
            allow_origins=["*"], allow_methods=["POST"], status_code=200)
        
        # Export API gateway to use in other Stacks
        CfnOutput(
            self, 'MyApiIdOutput',
            value=rest_api.rest_api_id,
            export_name='mainApiId',
        )
        CfnOutput(
            self, 'MyApiRootResourceIdOutput',
            value=rest_api.root.resource_id,
            export_name='mainApiRootResourceIdOutput',
        )