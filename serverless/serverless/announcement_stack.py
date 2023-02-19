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

        # Create getCourseAnnouncements AWS Lambda function
        get_generalannouncements = _lambda.Function(
            self,
            "getGeneralAnnouncements",  # name of your lambda function
            runtime=_lambda.Runtime.PYTHON_3_9,
            # change based on your python file name
            handler="get_generalannouncements.lambda_handler",
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
        generalannouncement_resource.add_method("PUT", apigw.LambdaIntegration(get_generalannouncements), request_parameters={
            'method.request.querystring.dateId': False
        })

        # Enable CORS for each resource/sub-resource etc.
        generalannouncement_resource.add_cors_preflight(
            allow_origins=["*"], allow_methods=["GET", "PUT", "DELETE"], status_code=200)
