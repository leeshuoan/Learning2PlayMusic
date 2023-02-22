import boto3

from aws_cdk import (
    aws_lambda as _lambda,
    aws_apigateway as apigw,
    aws_iam,
    Stack,
    Fn
)

from constructs import Construct

class UserStack(Stack):

    def __init__(self, scope: Construct, construct_id: str, **kwargs) -> None:
        super().__init__(scope, construct_id, **kwargs)

        FUNCTIONS_FOLDER = "./lambda_functions/"
        USER_FUNCTIONS_FOLDER = "user."
        USER_STUDENT_FUNCTIONS_FOLDER = USER_FUNCTIONS_FOLDER + "student."
        USER_STUDENT_COURSE_FUNCTIONS_FOLDER = USER_STUDENT_FUNCTIONS_FOLDER + "course"

        # Get existing iam role (lambda-general-role)
        iam = boto3.client("iam")
        role = iam.get_role(RoleName="lambda-general-role")
        role_arn = role["Role"]["Arn"]
        LAMBDA_ROLE = aws_iam.Role.from_role_arn(
          self, "lambda-general-role",role_arn)

        # /user/student/courses Functions
        get_student_course = _lambda.Function(self, "getStudentCourse", runtime=_lambda.Runtime.PYTHON_3_9, handler=f"{USER_STUDENT_COURSE_FUNCTIONS_FOLDER}.get_student_course.lambda_handler", code=_lambda.Code.from_asset(FUNCTIONS_FOLDER), role=LAMBDA_ROLE)
        post_student_course = _lambda.Function(self, "postStudentCourse", runtime=_lambda.Runtime.PYTHON_3_9, handler=f"{USER_STUDENT_COURSE_FUNCTIONS_FOLDER}.post_student_course.lambda_handler", code=_lambda.Code.from_asset(FUNCTIONS_FOLDER), role=LAMBDA_ROLE)
        delete_student_course = _lambda.Function(self, "deleteStudentCourse", runtime=_lambda.Runtime.PYTHON_3_9, handler=f"{USER_STUDENT_COURSE_FUNCTIONS_FOLDER}.delete_student_course.lambda_handler", code=_lambda.Code.from_asset(FUNCTIONS_FOLDER), role=LAMBDA_ROLE)

        # define the attributes of the existing REST API
        rest_api_id = Fn.import_value("mainApiId")
        root_resource_id = Fn.import_value("mainApiRootResourceIdOutput")

        # Retrieve the Amazon API Gateway REST API
        main_api = apigw.RestApi.from_rest_api_attributes(
            self, "main", rest_api_id=rest_api_id, root_resource_id=root_resource_id)

        # Create resources for the API
        user_resource = main_api.root.add_resource("user")
        student_resource = user_resource.add_resource("student")
        student_course_resource = student_resource.add_resource("course")

        # Create methods in the required resources
        # /user/student/course
        student_course_resource.add_method("GET", apigw.LambdaIntegration(get_student_course), request_parameters={
          'method.request.querystring.studentId': True})

        student_course_resource.add_method("POST", apigw.LambdaIntegration(post_student_course), request_parameters={
          'method.request.querystring.studentId': True,
          'method.request.querystring.courseId': True})

        student_course_resource.add_method("DELETE", apigw.LambdaIntegration(delete_student_course), request_parameters={
          'method.request.querystring.studentId': True,
          'method.request.querystring.courseId': True})


        # Enable CORS for each resource/sub-resource etc.
        user_resource.add_cors_preflight(allow_origins=["*"], allow_methods=["GET", "POST", "DELETE"], status_code=200)
        student_resource.add_cors_preflight(allow_origins=["*"], allow_methods=["GET", "POST", "DELETE"], status_code=200)
        student_course_resource.add_cors_preflight(allow_origins=["*"], allow_methods=["GET", "POST", "DELETE"], status_code=200)