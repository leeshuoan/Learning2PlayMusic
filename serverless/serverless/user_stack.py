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
        USER_FUNCTIONS_FOLDER = "user"
        USER_STUDENT_FUNCTIONS_FOLDER = "user.student"
        USER_STUDENT_COURSE_FUNCTIONS_FOLDER = "user.student.course"
        USER_TEACHER_FUNCTIONS_FOLDER = "user.teacher"
        USER_TEACHER_COURSE_FUNCTIONS_FOLDER = "user.teacher.course"

        # Get existing iam role (lambda-general-role)
        iam = boto3.client("iam")
        role = iam.get_role(RoleName="lambda-general-role")
        role_arn = role["Role"]["Arn"]
        LAMBDA_ROLE = aws_iam.Role.from_role_arn(
          self, "lambda-general-role",role_arn)


        ########################
        ### LAMBDA FUNCTIONS ###
        ########################

        # /user/student
        get_student = _lambda.Function(self, "getStudent", runtime=_lambda.Runtime.PYTHON_3_9, handler=f"{USER_STUDENT_FUNCTIONS_FOLDER}.get_student.lambda_handler", code=_lambda.Code.from_asset(FUNCTIONS_FOLDER), role=LAMBDA_ROLE)
        post_student = _lambda.Function(self, "postStudent", runtime=_lambda.Runtime.PYTHON_3_9, handler=f"{USER_STUDENT_FUNCTIONS_FOLDER}.post_student.lambda_handler", code=_lambda.Code.from_asset(FUNCTIONS_FOLDER), role=LAMBDA_ROLE)
        put_student = _lambda.Function(self, "putStudent", runtime=_lambda.Runtime.PYTHON_3_9, handler=f"{USER_STUDENT_FUNCTIONS_FOLDER}.put_student.lambda_handler", code=_lambda.Code.from_asset(FUNCTIONS_FOLDER), role=LAMBDA_ROLE)
        delete_student = _lambda.Function(self, "deleteStudent", runtime=_lambda.Runtime.PYTHON_3_9, handler=f"{USER_STUDENT_FUNCTIONS_FOLDER}.delete_student.lambda_handler", code=_lambda.Code.from_asset(FUNCTIONS_FOLDER), role=LAMBDA_ROLE)

        # /user/student/courses
        get_student_course = _lambda.Function(self, "getStudentCourse", runtime=_lambda.Runtime.PYTHON_3_9, handler=f"{USER_STUDENT_COURSE_FUNCTIONS_FOLDER}.get_student_course.lambda_handler", code=_lambda.Code.from_asset(FUNCTIONS_FOLDER), role=LAMBDA_ROLE)
        post_student_course = _lambda.Function(self, "postStudentCourse", runtime=_lambda.Runtime.PYTHON_3_9, handler=f"{USER_STUDENT_COURSE_FUNCTIONS_FOLDER}.post_student_course.lambda_handler", code=_lambda.Code.from_asset(FUNCTIONS_FOLDER), role=LAMBDA_ROLE)
        delete_student_course = _lambda.Function(self, "deleteStudentCourse", runtime=_lambda.Runtime.PYTHON_3_9, handler=f"{USER_STUDENT_COURSE_FUNCTIONS_FOLDER}.delete_student_course.lambda_handler", code=_lambda.Code.from_asset(FUNCTIONS_FOLDER), role=LAMBDA_ROLE)

        # /user/teacher
        get_teacher = _lambda.Function(self, "getTeacher", runtime=_lambda.Runtime.PYTHON_3_9, handler=f"{USER_TEACHER_FUNCTIONS_FOLDER}.get_teacher.lambda_handler", code=_lambda.Code.from_asset(FUNCTIONS_FOLDER), role=LAMBDA_ROLE)
        post_teacher = _lambda.Function(self, "postTeacher", runtime=_lambda.Runtime.PYTHON_3_9, handler=f"{USER_TEACHER_FUNCTIONS_FOLDER}.post_teacher.lambda_handler", code=_lambda.Code.from_asset(FUNCTIONS_FOLDER), role=LAMBDA_ROLE)
        put_teacher = _lambda.Function(self, "putTeacher", runtime=_lambda.Runtime.PYTHON_3_9, handler=f"{USER_TEACHER_FUNCTIONS_FOLDER}.put_teacher.lambda_handler", code=_lambda.Code.from_asset(FUNCTIONS_FOLDER), role=LAMBDA_ROLE)
        delete_teacher = _lambda.Function(self, "deleteTeacher", runtime=_lambda.Runtime.PYTHON_3_9, handler=f"{USER_TEACHER_FUNCTIONS_FOLDER}.delete_teacher.lambda_handler", code=_lambda.Code.from_asset(FUNCTIONS_FOLDER), role=LAMBDA_ROLE)

        # /user/teacher/courses
        get_teacher_course = _lambda.Function(self, "getTeacherCourse", runtime=_lambda.Runtime.PYTHON_3_9, handler=f"{USER_TEACHER_COURSE_FUNCTIONS_FOLDER}.get_teacher_course.lambda_handler", code=_lambda.Code.from_asset(FUNCTIONS_FOLDER), role=LAMBDA_ROLE)
        post_teacher_course = _lambda.Function(self, "postTeacherCourse", runtime=_lambda.Runtime.PYTHON_3_9, handler=f"{USER_TEACHER_COURSE_FUNCTIONS_FOLDER}.post_teacher_course.lambda_handler", code=_lambda.Code.from_asset(FUNCTIONS_FOLDER), role=LAMBDA_ROLE)
        delete_teacher_course = _lambda.Function(self, "deleteTeacherCourse", runtime=_lambda.Runtime.PYTHON_3_9, handler=f"{USER_TEACHER_COURSE_FUNCTIONS_FOLDER}.delete_teacher_course.lambda_handler", code=_lambda.Code.from_asset(FUNCTIONS_FOLDER), role=LAMBDA_ROLE)

        ###########
        ### API ###
        ###########

        # define the attributes of the existing REST API
        rest_api_id = Fn.import_value("mainApiId")
        root_resource_id = Fn.import_value("mainApiRootResourceIdOutput")

        # Retrieve the Amazon API Gateway REST API
        main_api = apigw.RestApi.from_rest_api_attributes(
            self, "main", rest_api_id=rest_api_id, root_resource_id=root_resource_id)


        #####################
        ### API RESOURCES ###
        #####################

        # Create resources for the API
        user_resource = main_api.root.add_resource("user")
        student_resource = user_resource.add_resource("student")
        student_course_resource = student_resource.add_resource("course")
        teacher_resource = user_resource.add_resource("teacher")
        teacher_course_resource = teacher_resource.add_resource("course")


        ########################################
        ### API RESOURCES METHODS - STUDENTS ###
        ########################################

        # Create methods in the required resources
        # /user/student
        post_user_student_model = apigw.Model(
                self,
                "PostUserStudentModel",
                rest_api=main_api,
                content_type="application/json",
                model_name="PostUserStudentModel",
                schema=apigw.JsonSchema(
                    title="PostUserStudentModel",
                    schema=apigw.JsonSchemaVersion.DRAFT4,
                    type=apigw.JsonSchemaType.OBJECT,
                    properties={
                        "studentId": apigw.JsonSchema(type=apigw.JsonSchemaType.STRING),
                        "firstName": apigw.JsonSchema(type=apigw.JsonSchemaType.STRING),
                        "lastName": apigw.JsonSchema(type=apigw.JsonSchemaType.STRING),
                        "contactNumber": apigw.JsonSchema(type=apigw.JsonSchemaType.STRING)
                    },
                    required=["studentId", "firstName", "lastName", "contactNumber"]))

        put_user_student_model = apigw.Model(
                self,
                "PutUserStudentModel",
                rest_api=main_api,
                content_type="application/json",
                model_name="PutUserStudentModel",
                schema=apigw.JsonSchema(
                    title="PutUserStudentModel",
                    schema=apigw.JsonSchemaVersion.DRAFT4,
                    type=apigw.JsonSchemaType.OBJECT,
                    properties={
                        "studentId": apigw.JsonSchema(type=apigw.JsonSchemaType.STRING),
                        "firstName": apigw.JsonSchema(type=apigw.JsonSchemaType.STRING),
                        "lastName": apigw.JsonSchema(type=apigw.JsonSchemaType.STRING),
                        "contactNumber": apigw.JsonSchema(type=apigw.JsonSchemaType.STRING),
                        "isSoftDeleted": apigw.JsonSchema(type=apigw.JsonSchemaType.BOOLEAN)
                    },
                    required=["studentId", "firstName", "lastName", "contactNumber", "isSoftDeleted"]))

        student_resource.add_method("GET", apigw.LambdaIntegration(get_student), request_parameters={
          'method.request.querystring.studentId': False})

        student_resource.add_method("POST", apigw.LambdaIntegration(post_student), request_models={
          'application/json': post_user_student_model})

        student_resource.add_method("PUT", apigw.LambdaIntegration(put_student), request_models={
          'application/json': put_user_student_model})

        student_resource.add_method("DELETE", apigw.LambdaIntegration(delete_student), request_parameters={
          'method.request.querystring.studentId': True})

        # /user/student/course
        student_course_resource.add_method("GET", apigw.LambdaIntegration(get_student_course), request_parameters={
          'method.request.querystring.studentId': True})

        student_course_resource.add_method("POST", apigw.LambdaIntegration(post_student_course), request_parameters={
          'method.request.querystring.studentId': True,
          'method.request.querystring.courseId': True})

        student_course_resource.add_method("DELETE", apigw.LambdaIntegration(delete_student_course), request_parameters={
          'method.request.querystring.studentId': True,
          'method.request.querystring.courseId': True})


        ########################################
        ### API RESOURCES METHODS - TEACHERS ###
        ########################################

        # /user/teacher
        post_user_teacher_model = apigw.Model(
                self,
                "PostUserTeacherModel",
                rest_api=main_api,
                content_type="application/json",
                model_name="PostUserTeacherModel",
                schema=apigw.JsonSchema(
                    title="PostUserTeacherModel",
                    schema=apigw.JsonSchemaVersion.DRAFT4,
                    type=apigw.JsonSchemaType.OBJECT,
                    properties={
                        "teacherId": apigw.JsonSchema(type=apigw.JsonSchemaType.STRING),
                        "firstName": apigw.JsonSchema(type=apigw.JsonSchemaType.STRING),
                        "lastName": apigw.JsonSchema(type=apigw.JsonSchemaType.STRING),
                        "contactNumber": apigw.JsonSchema(type=apigw.JsonSchemaType.STRING)
                    },
                    required=["teacherId", "firstName", "lastName", "contactNumber"]))

        put_user_teacher_model = apigw.Model(
                self,
                "PutUserTeacherModel",
                rest_api=main_api,
                content_type="application/json",
                model_name="PutUserTeacherModel",
                schema=apigw.JsonSchema(
                    title="PutUserTeacherModel",
                    schema=apigw.JsonSchemaVersion.DRAFT4,
                    type=apigw.JsonSchemaType.OBJECT,
                    properties={
                        "teacherId": apigw.JsonSchema(type=apigw.JsonSchemaType.STRING),
                        "firstName": apigw.JsonSchema(type=apigw.JsonSchemaType.STRING),
                        "lastName": apigw.JsonSchema(type=apigw.JsonSchemaType.STRING),
                        "contactNumber": apigw.JsonSchema(type=apigw.JsonSchemaType.STRING),
                        "isSoftDeleted": apigw.JsonSchema(type=apigw.JsonSchemaType.BOOLEAN)
                    },
                    required=["teacherId", "firstName", "lastName", "contactNumber", "isSoftDeleted"]))

        teacher_resource.add_method("GET", apigw.LambdaIntegration(get_teacher), request_parameters={
          'method.request.querystring.teacherId': False})

        teacher_resource.add_method("POST", apigw.LambdaIntegration(post_teacher), request_models={
          'application/json': post_user_teacher_model})

        teacher_resource.add_method("PUT", apigw.LambdaIntegration(put_teacher), request_models={
          'application/json': put_user_teacher_model})

        teacher_resource.add_method("DELETE", apigw.LambdaIntegration(delete_teacher), request_parameters={
          'method.request.querystring.teacherId': True})

        # /user/teacher/course
        teacher_course_resource.add_method("GET", apigw.LambdaIntegration(get_teacher_course), request_parameters={
          'method.request.querystring.teacherId': True})

        teacher_course_resource.add_method("POST", apigw.LambdaIntegration(post_teacher_course), request_parameters={
          'method.request.querystring.teacherId': True,
          'method.request.querystring.courseId': True})

        teacher_course_resource.add_method("DELETE", apigw.LambdaIntegration(delete_teacher_course), request_parameters={
          'method.request.querystring.teacherId': True,
          'method.request.querystring.courseId': True})


        ############
        ### CORS ###
        ############

        # Enable CORS for each resource/sub-resource etc.
        user_resource.add_cors_preflight(allow_origins=["*"], allow_methods=["GET", "POST", "DELETE", "PUT"], status_code=200)
        student_resource.add_cors_preflight(allow_origins=["*"], allow_methods=["GET", "POST", "DELETE", "PUT"], status_code=200)
        student_course_resource.add_cors_preflight(allow_origins=["*"], allow_methods=["GET", "POST", "DELETE", "PUT"], status_code=200)
        teacher_resource.add_cors_preflight(allow_origins=["*"], allow_methods=["GET", "POST", "DELETE", "PUT"], status_code=200)
        teacher_course_resource.add_cors_preflight(allow_origins=["*"], allow_methods=["GET", "POST", "DELETE", "PUT"], status_code=200)