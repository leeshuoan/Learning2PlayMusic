import boto3

from aws_cdk import (
    aws_lambda as _lambda,
    aws_apigateway as apigw,
    aws_iam,
    Stack,
    Fn
)

from constructs import Construct


class AnnouncementStack(Stack):

    def __init__(self, scope: Construct, construct_id: str, **kwargs) -> None:
        super().__init__(scope, construct_id, **kwargs)

        # Define Constants Here
        FUNCTIONS_FOLDER = "./lambda_functions/"
        GENERALANNOUNCEMENT_FUNCTIONS_FOLDER = FUNCTIONS_FOLDER+"generalannouncement/"

        # Get existing iam role (lambda-general-role)
        iam = boto3.client("iam")
        role = iam.get_role(RoleName="lambda-general-role")
        role_arn = role["Role"]["Arn"]
        LAMBDA_ROLE = aws_iam.Role.from_role_arn(
            self, "lambda-general-role", role_arn)

        # /generalannouncements Functions
        get_generalannouncement = _lambda.Function(
            self,
            "getGeneralAnnouncement",  # name of your lambda function
            runtime=_lambda.Runtime.PYTHON_3_9,
            # change based on your python file name
            handler="get_generalannouncement.lambda_handler",
            code=_lambda.Code.from_asset(GENERALANNOUNCEMENT_FUNCTIONS_FOLDER),
            role=LAMBDA_ROLE
        )

        post_generalannouncement = _lambda.Function(
            self,
            "getGeneralAnnouncement",  # name of your lambda function
            runtime=_lambda.Runtime.PYTHON_3_9,
            # change based on your python file name
            handler="post_generalannouncement.lambda_handler",
            code=_lambda.Code.from_asset(GENERALANNOUNCEMENT_FUNCTIONS_FOLDER),
            role=LAMBDA_ROLE
        )

        delete_generalannouncement = _lambda.Function(
            self,
            "getGeneralAnnouncement",  # name of your lambda function
            runtime=_lambda.Runtime.PYTHON_3_9,
            # change based on your python file name
            handler="delete_generalannouncement.lambda_handler",
            code=_lambda.Code.from_asset(GENERALANNOUNCEMENT_FUNCTIONS_FOLDER),
            role=LAMBDA_ROLE
        )

        # define the attributes of the existing REST API
        rest_api_id = Fn.import_value("mainApiId")
        root_resource_id = Fn.import_value("mainApiRootResourceIdOutput")

        # Retrieve the Amazon API Gateway REST API
        main_api = apigw.RestApi.from_rest_api_attributes(
            self, "main", rest_api_id=rest_api_id, root_resource_id=root_resource_id)

        # Create resources for the API
        generalannouncement_resource = main_api.root.add_resource(
            "generalannouncement")

        # /generalannouncements
        generalannouncement_resource.add_method("POST", apigw.LambdaIntegration(post_generalannouncement), request_parameters={
            'method.request.querystring.dateId': False
        })
        generalannouncement_resource.add_method("GET", apigw.LambdaIntegration(get_generalannouncement), request_parameters={
            'method.request.querystring.dateId': False
        })
        generalannouncement_resource.add_method("DELETE", apigw.LambdaIntegration(delete_generalannouncement), request_parameters={
            'method.request.querystring.dateId': False
        })

        # Enable CORS for each resource/sub-resource etc.
        generalannouncement_resource.add_cors_preflight(
            allow_origins=["*"], allow_methods=["GET", "PUT", "DELETE"], status_code=200)
