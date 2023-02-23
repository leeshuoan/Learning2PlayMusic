from aws_cdk import core
from aws_cdk import aws_lambda as _lambda
from aws_cdk import aws_apigateway as apigateway
from aws_cdk import aws_dynamodb as dynamodb

class MyServerlessAppStack(core.Stack):
    def __init__(self, scope: core.Construct, id: str, **kwargs) -> None:
        super().__init__(scope, id, **kwargs)

        # create a DynamoDB table
        table = dynamodb.Table(self, "myTable",
                               partition_key=dynamodb.Attribute(
                                   name="id", type=dynamodb.AttributeType.STRING))

        # create a Lambda function
        handler = _lambda.Function(self, "myLambda",
                                    runtime=_lambda.Runtime.PYTHON_3_8,
                                    code=_lambda.Code.from_asset("lambda"),
                                    handler="main.handler",
                                    environment={
                                        'TABLE_NAME': table.table_name
                                    })

        # grant the Lambda function permissions to access the DynamoDB table
        table.grant_read_write_data(handler)

        # create an API Gateway REST API
        rest_api = apigateway.RestApi(self, "myRestApi")

        # create a resource and method for the API
        resource = rest_api.root.add_resource("items")
        get_method = resource.add_method("GET", apigateway.LambdaIntegration(handler))

        # add a request validator to the GET method
        get_method.request_validator = apigateway.RequestValidator(
            self, "myRequestValidator",
            validate_request_body=True,
            validate_request_parameters=True
        )
