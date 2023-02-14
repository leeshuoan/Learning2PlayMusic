from aws_cdk import (
    aws_lambda as _lambda,
    aws_apigateway as apigw,
    Stack
)

from constructs import Construct

class ServerlessStack(Stack):

    def __init__(self, scope: Construct, construct_id: str, **kwargs) -> None:
        super().__init__(scope, construct_id, **kwargs)

        # The code that defines your stack goes here

        # Create an AWS Lambda function
        get_course_quizzes = _lambda.Function(
            self,
            "getCourseQuizzes", # name of your lambda function
            runtime=_lambda.Runtime.PYTHON_3_9,
            handler="get_course_quizzes.lambda_handler", # change based on your python file name
            code=_lambda.Code.from_asset("./lambda_functions/")
        )
        
        # Create a new Amazon API Gateway REST API
        course2_api = apigw.RestApi(self, "course2",
                            description="This is my API from the CDK and SAM")

        # Create a new resource for the API
        course_resource = course2_api.root.add_resource("course")
        
        # Create a sub-resource under the parent resource
        course_quizzes_resource = course_resource.add_resource("quizzes")
        
        course_quizzes_resource.add_method("GET", apigw.LambdaIntegration(get_course_quizzes))
