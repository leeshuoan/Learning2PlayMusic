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
        USER_CHAT_FUNCTIONS_FOLDER = "user.chat"
        USER_CHAT_CONTACTLIST_FUNCTIONS_FOLDER = "user.chat.contactlist"

        USER_STUDENT_FUNCTIONS_FOLDER = "user.student"
        USER_STUDENT_COURSE_FUNCTIONS_FOLDER = "user.student.course"
        # USER_STUDENT_CHAT_FUNCTIONS_FOLDER = "user.student.chat"

        USER_TEACHER_FUNCTIONS_FOLDER = "user.teacher"
        USER_TEACHER_COURSE_FUNCTIONS_FOLDER = "user.teacher.course"
        # USER_TEACHER_CHAT_FUNCTIONS_FOLDER = "user.teacher.chat"
        # USER_TEACHER_CHAT_CONTACTLIST_FUNCTIONS_FOLDER = "user.teacher.chat.contactlist"

        USER_ADMIN_FUNCTIONS_FOLDER = "user.admin"
        # USER_ADMIN_CHAT_FUNCTIONS_FOLDER = "user.admin.chat"
        # USER_ADMIN_CHAT_CONTACTLIST_FUNCTIONS_FOLDER = "user.admin.chat.contactlist"

        # Get existing iam role (lambda-general-role)
        iam = boto3.client("iam")
        role = iam.get_role(RoleName="lambda-general-role")
        role_arn = role["Role"]["Arn"]
        LAMBDA_ROLE = aws_iam.Role.from_role_arn(
          self, "lambda-general-role",role_arn)

        #####################
        #   LAMBDA - USER   #
        #####################

        # /user/chat
        # get_user_chat = _lambda.Function(self, "getUserChat", runtime=_lambda.Runtime.PYTHON_3_9, handler=f"{USER_CHAT_FUNCTIONS_FOLDER}.get_user_chat.lambda_handler", code=_lambda.Code.from_asset(FUNCTIONS_FOLDER), role=LAMBDA_ROLE)
        # post_user_chat = _lambda.Function(self, "PostUserChat", runtime=_lambda.Runtime.PYTHON_3_9, handler=f"{USER_CHAT_FUNCTIONS_FOLDER}.post_user_chat.lambda_handler", code=_lambda.Code.from_asset(FUNCTIONS_FOLDER), role=LAMBDA_ROLE)

        # /user/chat/contactlist
        get_user_chat_contactlist = _lambda.Function(self, "getUserChatContactList", runtime=_lambda.Runtime.PYTHON_3_9, handler=f"{USER_CHAT_CONTACTLIST_FUNCTIONS_FOLDER}.get_user_chat_contactlist.lambda_handler", code=_lambda.Code.from_asset(FUNCTIONS_FOLDER), role=LAMBDA_ROLE)


        #########################
        #  LAMBDA - STUDENTS   #
        #########################

        # /user/student
        get_student = _lambda.Function(self, "getStudent", runtime=_lambda.Runtime.PYTHON_3_9, handler=f"{USER_STUDENT_FUNCTIONS_FOLDER}.get_student.lambda_handler", code=_lambda.Code.from_asset(FUNCTIONS_FOLDER), role=LAMBDA_ROLE)
        # post_student = _lambda.Function(self, "postStudent", runtime=_lambda.Runtime.PYTHON_3_9, handler=f"{USER_STUDENT_FUNCTIONS_FOLDER}.post_student.lambda_handler", code=_lambda.Code.from_asset(FUNCTIONS_FOLDER), role=LAMBDA_ROLE)
        # put_student = _lambda.Function(self, "putStudent", runtime=_lambda.Runtime.PYTHON_3_9, handler=f"{USER_STUDENT_FUNCTIONS_FOLDER}.put_student.lambda_handler", code=_lambda.Code.from_asset(FUNCTIONS_FOLDER), role=LAMBDA_ROLE)
        # delete_student = _lambda.Function(self, "deleteStudent", runtime=_lambda.Runtime.PYTHON_3_9, handler=f"{USER_STUDENT_FUNCTIONS_FOLDER}.delete_student.lambda_handler", code=_lambda.Code.from_asset(FUNCTIONS_FOLDER), role=LAMBDA_ROLE)

        # /user/student/courses
        get_student_course = _lambda.Function(self, "getStudentCourse", runtime=_lambda.Runtime.PYTHON_3_9, handler=f"{USER_STUDENT_COURSE_FUNCTIONS_FOLDER}.get_student_course.lambda_handler", code=_lambda.Code.from_asset(FUNCTIONS_FOLDER), role=LAMBDA_ROLE)
        post_student_course = _lambda.Function(self, "postStudentCourse", runtime=_lambda.Runtime.PYTHON_3_9, handler=f"{USER_STUDENT_COURSE_FUNCTIONS_FOLDER}.post_student_course.lambda_handler", code=_lambda.Code.from_asset(FUNCTIONS_FOLDER), role=LAMBDA_ROLE)
        delete_student_course = _lambda.Function(self, "deleteStudentCourse", runtime=_lambda.Runtime.PYTHON_3_9, handler=f"{USER_STUDENT_COURSE_FUNCTIONS_FOLDER}.delete_student_course.lambda_handler", code=_lambda.Code.from_asset(FUNCTIONS_FOLDER), role=LAMBDA_ROLE)

        # # /user/student/chat/contactlist
        # get_student_chat = _lambda.Function(self, "getStudentChat", runtime=_lambda.Runtime.PYTHON_3_9, handler=f"{USER_STUDENT_CHAT_FUNCTIONS_FOLDER}.get_student_chat.lambda_handler", code=_lambda.Code.from_asset(FUNCTIONS_FOLDER), role=LAMBDA_ROLE)
        # post_student_chat = _lambda.Function(self, "postStudentChat", runtime=_lambda.Runtime.PYTHON_3_9, handler=f"{USER_STUDENT_CHAT_FUNCTIONS_FOLDER}.post_student_chat.lambda_handler", code=_lambda.Code.from_asset(FUNCTIONS_FOLDER), role=LAMBDA_ROLE)

        # # /user/student/contactlist
        # get_student_chat_contactlist = _lambda.Function(self, "getStudentChatContactList", runtime=_lambda.Runtime.PYTHON_3_9, handler=f"{USER_STUDENT_CHAT_CONTACTLIST_FUNCTIONS_FOLDER}.get_student_chat_contactlist.lambda_handler", code=_lambda.Code.from_asset(FUNCTIONS_FOLDER), role=LAMBDA_ROLE)

        #########################
        ##  LAMBDA - TEACHERS   #
        #########################

        # /user/teacher
        get_teacher = _lambda.Function(self, "getTeacher", runtime=_lambda.Runtime.PYTHON_3_9, handler=f"{USER_TEACHER_FUNCTIONS_FOLDER}.get_teacher.lambda_handler", code=_lambda.Code.from_asset(FUNCTIONS_FOLDER), role=LAMBDA_ROLE)
        # post_teacher = _lambda.Function(self, "postTeacher", runtime=_lambda.Runtime.PYTHON_3_9, handler=f"{USER_TEACHER_FUNCTIONS_FOLDER}.post_teacher.lambda_handler", code=_lambda.Code.from_asset(FUNCTIONS_FOLDER), role=LAMBDA_ROLE)
        # put_teacher = _lambda.Function(self, "putTeacher", runtime=_lambda.Runtime.PYTHON_3_9, handler=f"{USER_TEACHER_FUNCTIONS_FOLDER}.put_teacher.lambda_handler", code=_lambda.Code.from_asset(FUNCTIONS_FOLDER), role=LAMBDA_ROLE)
        # delete_teacher = _lambda.Function(self, "deleteTeacher", runtime=_lambda.Runtime.PYTHON_3_9, handler=f"{USER_TEACHER_FUNCTIONS_FOLDER}.delete_teacher.lambda_handler", code=_lambda.Code.from_asset(FUNCTIONS_FOLDER), role=LAMBDA_ROLE)

        # /user/teacher/courses
        get_teacher_course = _lambda.Function(self, "getTeacherCourse", runtime=_lambda.Runtime.PYTHON_3_9, handler=f"{USER_TEACHER_COURSE_FUNCTIONS_FOLDER}.get_teacher_course.lambda_handler", code=_lambda.Code.from_asset(FUNCTIONS_FOLDER), role=LAMBDA_ROLE)
        post_teacher_course = _lambda.Function(self, "postTeacherCourse", runtime=_lambda.Runtime.PYTHON_3_9, handler=f"{USER_TEACHER_COURSE_FUNCTIONS_FOLDER}.post_teacher_course.lambda_handler", code=_lambda.Code.from_asset(FUNCTIONS_FOLDER), role=LAMBDA_ROLE)
        delete_teacher_course = _lambda.Function(self, "deleteTeacherCourse", runtime=_lambda.Runtime.PYTHON_3_9, handler=f"{USER_TEACHER_COURSE_FUNCTIONS_FOLDER}.delete_teacher_course.lambda_handler", code=_lambda.Code.from_asset(FUNCTIONS_FOLDER), role=LAMBDA_ROLE)

        # # /user/teacher/chat/contactlist
        # get_teacher_chat = _lambda.Function(self, "getTeacherChat", runtime=_lambda.Runtime.PYTHON_3_9, handler=f"{USER_TEACHER_CHAT_FUNCTIONS_FOLDER}.get_teacher_chat.lambda_handler", code=_lambda.Code.from_asset(FUNCTIONS_FOLDER), role=LAMBDA_ROLE)
        # post_teacher_chat = _lambda.Function(self, "postTeacherChat", runtime=_lambda.Runtime.PYTHON_3_9, handler=f"{USER_TEACHER_CHAT_FUNCTIONS_FOLDER}.post_teacher_chat.lambda_handler", code=_lambda.Code.from_asset(FUNCTIONS_FOLDER), role=LAMBDA_ROLE)

        # # /user/teacher/contactlist
        # get_teacher_chat_contactlist = _lambda.Function(self, "getTeacherChatContactList", runtime=_lambda.Runtime.PYTHON_3_9, handler=f"{USER_TEACHER_CHAT_CONTACTLIST_FUNCTIONS_FOLDER}.get_teacher_chat_contactlist.lambda_handler", code=_lambda.Code.from_asset(FUNCTIONS_FOLDER), role=LAMBDA_ROLE)

        ########################
        #   LAMBDA - ADMINS    #
        ########################

        # /user/admin
        get_admin = _lambda.Function(self, "getAdmin", runtime=_lambda.Runtime.PYTHON_3_9, handler=f"{USER_ADMIN_FUNCTIONS_FOLDER}.get_admin.lambda_handler", code=_lambda.Code.from_asset(FUNCTIONS_FOLDER), role=LAMBDA_ROLE)

        # # /user/admin/chat
        # get_admin_chat = _lambda.Function(self, "getAdminChat", runtime=_lambda.Runtime.PYTHON_3_9, handler=f"{USER_ADMIN_CHAT_FUNCTIONS_FOLDER}.get_admin_chat.lambda_handler", code=_lambda.Code.from_asset(FUNCTIONS_FOLDER), role=LAMBDA_ROLE)
        # post_admin_chat = _lambda.Function(self, "postAdminChat", runtime=_lambda.Runtime.PYTHON_3_9, handler=f"{USER_ADMIN_CHAT_FUNCTIONS_FOLDER}.post_admin_chat.lambda_handler", code=_lambda.Code.from_asset(FUNCTIONS_FOLDER), role=LAMBDA_ROLE)

        # # /user/admin/chat/contactlist
        # get_admin_chat_contactlist = _lambda.Function(self, "getAdminChatContactList", runtime=_lambda.Runtime.PYTHON_3_9, handler=f"{USER_ADMIN_CHAT_CONTACTLIST_FUNCTIONS_FOLDER}.get_admin_chat_contactlist.lambda_handler", code=_lambda.Code.from_asset(FUNCTIONS_FOLDER), role=LAMBDA_ROLE)


        ##############
        #   API GW   #
        ##############

        # define the attributes of the existing REST API
        rest_api_id = Fn.import_value("mainApiId")
        root_resource_id = Fn.import_value("mainApiRootResourceIdOutput")

        # Retrieve the Amazon API Gateway REST API
        main_api = apigw.RestApi.from_rest_api_attributes(
            self, "main", rest_api_id=rest_api_id, root_resource_id=root_resource_id)


        ########################
        #   API GW RESOURCES   #
        ########################

        # Create resources for the API
        user_resource = main_api.root.add_resource("user")
        user_chat_resource = user_resource.add_resource("chat")
        user_chat_contactlist_resource = user_chat_resource.add_resource("contactlist")

        student_resource = user_resource.add_resource("student")
        student_course_resource = student_resource.add_resource("course")
        # student_chat_resource = student_resource.add_resource("chat")
        # student_chat_contactlist_resource = student_chat_resource.add_resource("contactlist")

        teacher_resource = user_resource.add_resource("teacher")
        teacher_course_resource = teacher_resource.add_resource("course")
        # teacher_chat_resource = teacher_resource.add_resource("chat")
        # teacher_chat_contactlist_resource = teacher_chat_resource.add_resource("contactlist")

        admin_resource = user_resource.add_resource("admin")
        # admin_chat_resource = admin_resource.add_resource("chat")
        # admin_chat_contactlist_resource = admin_chat_resource.add_resource("contactlist")


        ########################################
        #   API GW RESOURCES METHODS - USERS   #
        ########################################

        # /user/chat
        # user_chat_resource.add_method("GET", apigw.LambdaIntegration(get_user_chat), request_parameters={
        #   'method.request.querystring.userId': True})
        # user_chat_resource.add_method("POST", apigw.LambdaIntegration(post_user_chat), request_parameters={
        #   'method.request.querystring.firstUserId': True,
        #   'method.request.querystring.secondUserId': True})

        # /user/chat/contactlist
        user_chat_contactlist_resource.add_method("GET", apigw.LambdaIntegration(get_user_chat_contactlist), request_parameters={
          'method.request.querystring.userId': True})


        ###########################################
        #   API GW RESOURCES METHODS - STUDENTS   #
        ###########################################

        # Create methods in the required resources
        # /user/student
        # post_user_student_model = apigw.Model(
        #         self,
        #         "PostUserStudentModel",
        #         rest_api=main_api,
        #         content_type="application/json",
        #         model_name="PostUserStudentModel",
        #         schema=apigw.JsonSchema(
        #             title="PostUserStudentModel",
        #             schema=apigw.JsonSchemaVersion.DRAFT4,
        #             type=apigw.JsonSchemaType.OBJECT,
        #             properties={
        #                 "studentId": apigw.JsonSchema(type=apigw.JsonSchemaType.STRING),
        #                 "firstName": apigw.JsonSchema(type=apigw.JsonSchemaType.STRING),
        #                 "lastName": apigw.JsonSchema(type=apigw.JsonSchemaType.STRING),
        #                 "contactNumber": apigw.JsonSchema(type=apigw.JsonSchemaType.STRING)
        #             },
        #             required=["studentId", "firstName", "lastName", "contactNumber"]))

        # put_user_student_model = apigw.Model(
        #         self,
        #         "PutUserStudentModel",
        #         rest_api=main_api,
        #         content_type="application/json",
        #         model_name="PutUserStudentModel",
        #         schema=apigw.JsonSchema(
        #             title="PutUserStudentModel",
        #             schema=apigw.JsonSchemaVersion.DRAFT4,
        #             type=apigw.JsonSchemaType.OBJECT,
        #             properties={
        #                 "studentId": apigw.JsonSchema(type=apigw.JsonSchemaType.STRING),
        #                 "firstName": apigw.JsonSchema(type=apigw.JsonSchemaType.STRING),
        #                 "lastName": apigw.JsonSchema(type=apigw.JsonSchemaType.STRING),
        #                 "contactNumber": apigw.JsonSchema(type=apigw.JsonSchemaType.STRING),
        #                 "isSoftDeleted": apigw.JsonSchema(type=apigw.JsonSchemaType.BOOLEAN)
        #             },
        #             required=["studentId", "firstName", "lastName", "contactNumber", "isSoftDeleted"]))

        student_resource.add_method("GET", apigw.LambdaIntegration(get_student), request_parameters={
          'method.request.querystring.studentId': False})

        # student_resource.add_method("POST", apigw.LambdaIntegration(post_student), request_models={
        #   'application/json': post_user_student_model})

        # student_resource.add_method("PUT", apigw.LambdaIntegration(put_student), request_models={
        #   'application/json': put_user_student_model})

        # student_resource.add_method("DELETE", apigw.LambdaIntegration(delete_student), request_parameters={
        #   'method.request.querystring.studentId': True})

        # /user/student/course
        student_course_resource.add_method("GET", apigw.LambdaIntegration(get_student_course), request_parameters={
          'method.request.querystring.studentId': True})

        student_course_resource.add_method("POST", apigw.LambdaIntegration(post_student_course), request_parameters={
          'method.request.querystring.studentId': True,
          'method.request.querystring.courseId': True})

        student_course_resource.add_method("DELETE", apigw.LambdaIntegration(delete_student_course), request_parameters={
          'method.request.querystring.studentId': True,
          'method.request.querystring.courseId': True})

        # # /user/student/chat
        # student_chat_resource.add_method("GET", apigw.LambdaIntegration(get_student_chat), request_parameters={
        #   'method.request.querystring.studentId': True})
        # student_chat_resource.add_method("POST", apigw.LambdaIntegration(post_student_chat), request_parameters={
        #   'method.request.querystring.studentId': True,
        #   'method.request.querystring.userId': True})

        # # /user/student/contactlist
        # student_chat_contactlist_resource.add_method("GET", apigw.LambdaIntegration(get_student_chat_contactlist), request_parameters={
        #   'method.request.querystring.studentId': True})


        ###########################################
        #   API GW RESOURCES METHODS - TEACHERS   #
        ###########################################

        # # /user/teacher
        # post_user_teacher_model = apigw.Model(
        #         self,
        #         "PostUserTeacherModel",
        #         rest_api=main_api,
        #         content_type="application/json",
        #         model_name="PostUserTeacherModel",
        #         schema=apigw.JsonSchema(
        #             title="PostUserTeacherModel",
        #             schema=apigw.JsonSchemaVersion.DRAFT4,
        #             type=apigw.JsonSchemaType.OBJECT,
        #             properties={
        #                 "teacherId": apigw.JsonSchema(type=apigw.JsonSchemaType.STRING),
        #                 "firstName": apigw.JsonSchema(type=apigw.JsonSchemaType.STRING),
        #                 "lastName": apigw.JsonSchema(type=apigw.JsonSchemaType.STRING),
        #                 "contactNumber": apigw.JsonSchema(type=apigw.JsonSchemaType.STRING)
        #             },
        #             required=["teacherId", "firstName", "lastName", "contactNumber"]))

        # put_user_teacher_model = apigw.Model(
        #         self,
        #         "PutUserTeacherModel",
        #         rest_api=main_api,
        #         content_type="application/json",
        #         model_name="PutUserTeacherModel",
        #         schema=apigw.JsonSchema(
        #             title="PutUserTeacherModel",
        #             schema=apigw.JsonSchemaVersion.DRAFT4,
        #             type=apigw.JsonSchemaType.OBJECT,
        #             properties={
        #                 "teacherId": apigw.JsonSchema(type=apigw.JsonSchemaType.STRING),
        #                 "firstName": apigw.JsonSchema(type=apigw.JsonSchemaType.STRING),
        #                 "lastName": apigw.JsonSchema(type=apigw.JsonSchemaType.STRING),
        #                 "contactNumber": apigw.JsonSchema(type=apigw.JsonSchemaType.STRING),
        #                 "isSoftDeleted": apigw.JsonSchema(type=apigw.JsonSchemaType.BOOLEAN)
        #             },
        #             required=["teacherId", "firstName", "lastName", "contactNumber", "isSoftDeleted"]))

        teacher_resource.add_method("GET", apigw.LambdaIntegration(get_teacher), request_parameters={
          'method.request.querystring.teacherId': False})

        # teacher_resource.add_method("POST", apigw.LambdaIntegration(post_teacher), request_models={
        #   'application/json': post_user_teacher_model})

        # teacher_resource.add_method("PUT", apigw.LambdaIntegration(put_teacher), request_models={
        #   'application/json': put_user_teacher_model})

        # teacher_resource.add_method("DELETE", apigw.LambdaIntegration(delete_teacher), request_parameters={
        #   'method.request.querystring.teacherId': True})

        # /user/teacher/course
        teacher_course_resource.add_method("GET", apigw.LambdaIntegration(get_teacher_course), request_parameters={
          'method.request.querystring.teacherId': True})

        teacher_course_resource.add_method("POST", apigw.LambdaIntegration(post_teacher_course), request_parameters={
          'method.request.querystring.teacherId': True,
          'method.request.querystring.courseId': True})

        teacher_course_resource.add_method("DELETE", apigw.LambdaIntegration(delete_teacher_course), request_parameters={
          'method.request.querystring.teacherId': True,
          'method.request.querystring.courseId': True})

        # # /user/teacher/chat
        # teacher_chat_resource.add_method("GET", apigw.LambdaIntegration(get_teacher_chat), request_parameters={
        #   'method.request.querystring.teacherId': True})
        # teacher_chat_resource.add_method("POST", apigw.LambdaIntegration(post_teacher_chat), request_parameters={
        #   'method.request.querystring.teacherId': True,
        #   'method.request.querystring.userId': True})

        # # /user/teacher/chat/contactlist
        # teacher_chat_contactlist_resource.add_method("GET", apigw.LambdaIntegration(get_teacher_chat_contactlist), request_parameters={
        #   'method.request.querystring.teacherId': True})


        #########################################
        #   API GW RESOURCES METHODS - ADMINS   #
        #########################################

        # /user/admin
        admin_resource.add_method("GET", apigw.LambdaIntegration(get_admin), request_parameters={
          'method.request.querystring.adminId': False})

        # # /user/admin/chat
        # admin_chat_resource.add_method("GET", apigw.LambdaIntegration(get_admin_chat), request_parameters={
        #   'method.request.querystring.adminId': True})

        # admin_chat_resource.add_method("POST", apigw.LambdaIntegration(post_admin_chat), request_parameters={
        #   'method.request.querystring.adminId': True,
        #   'method.request.querystring.userId': True})

        # # /user/admin/chat/contactlist
        # admin_chat_contactlist_resource.add_method("GET", apigw.LambdaIntegration(get_admin_chat_contactlist), request_parameters={
        #   'method.request.querystring.adminId': True})


        ############
        #   CORS   #
        ############

        # Enable CORS for each resource/sub-resource etc.
        user_resource.add_cors_preflight(allow_origins=["*"], allow_methods=["GET", "POST", "DELETE", "PUT"], status_code=200)

        student_resource.add_cors_preflight(allow_origins=["*"], allow_methods=["GET", "POST", "DELETE", "PUT"], status_code=200)
        student_course_resource.add_cors_preflight(allow_origins=["*"], allow_methods=["GET", "POST", "DELETE", "PUT"], status_code=200)
        # student_chat_resource.add_cors_preflight(allow_origins=["*"], allow_methods=["GET", "POST", "DELETE", "PUT"], status_code=200)
        # student_chat_contactlist_resource.add_cors_preflight(allow_origins=["*"], allow_methods=["GET", "POST", "DELETE", "PUT"], status_code=200)

        teacher_resource.add_cors_preflight(allow_origins=["*"], allow_methods=["GET", "POST", "DELETE", "PUT"], status_code=200)
        teacher_course_resource.add_cors_preflight(allow_origins=["*"], allow_methods=["GET", "POST", "DELETE", "PUT"], status_code=200)
        # teacher_chat_resource.add_cors_preflight(allow_origins=["*"], allow_methods=["GET", "POST", "DELETE", "PUT"], status_code=200)
        # teacher_chat_contactlist_resource.add_cors_preflight(allow_origins=["*"], allow_methods=["GET", "POST", "DELETE", "PUT"], status_code=200)

        admin_resource.add_cors_preflight(allow_origins=["*"], allow_methods=["GET", "POST", "DELETE", "PUT"], status_code=200)
        # admin_chat_resource.add_cors_preflight(allow_origins=["*"], allow_methods=["GET", "POST", "DELETE", "PUT"], status_code=200)
        # admin_chat_contactlist_resource.add_cors_preflight(allow_origins=["*"], allow_methods=["GET", "POST", "DELETE", "PUT"], status_code=200)