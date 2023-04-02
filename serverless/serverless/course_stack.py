import boto3
from aws_cdk import BundlingOptions, CfnOutput, Stack
from aws_cdk import aws_apigateway as apigw
from aws_cdk import aws_iam
from aws_cdk import aws_lambda as _lambda
from aws_cdk import aws_s3 as s3
from aws_cdk import aws_sns as sns
from constructs import Construct


class CourseStack(Stack):
    def __init__(self, scope: Construct, construct_id: str, **kwargs) -> None:
        super().__init__(scope, construct_id, **kwargs)

        # The code that defines your stack goes here

        #################
        ### CONSTANTS ###
        #################

        FUNCTIONS_FOLDER = "./lambda_functions/"
        COURSE_FUNCTIONS_FOLDER = "course"
        COURSE_STUDENT_FUNCTIONS_FOLDER = "course.student"
        COURSE_TEACHER_FUNCTIONS_FOLDER = "course.teacher"
        COURSE_MATERIAL_FUNCTIONS_FOLDER = "course_material"
        COURSE_HOMEWORK_FUNCTIONS_FOLDER = "course_homework"
        COURSE_QUIZ_FUNCTIONS_FOLDER = "course_quiz"
        COURSE_ANNOUNCEMENT_FUNCTIONS_FOLDER = "course_announcement"
        COURSE_CLASSLIST_FUNCTIONS_FOLDER = "course_classlist"
        COURSE_REPORT_FUNCTIONS_FOLDERS = "course_report"

        ##########
        ### S3 ###
        ##########

        # Create S3 bucket with read/write allowed
        L2PMA_question_image_bucket = s3.Bucket(self, "L2PMAQuestionImageBucket")
        L2PMA_question_image_bucket_policy_statement = aws_iam.PolicyStatement(
            effect=aws_iam.Effect.ALLOW,
            actions=[
                "s3:GetObject",
                "s3:PutObject",
            ],
            resources=[L2PMA_question_image_bucket.arn_for_objects("*")],
            principals=[aws_iam.ServicePrincipal("lambda.amazonaws.com")],
        )
        L2PMA_question_image_bucket.add_to_resource_policy(
            L2PMA_question_image_bucket_policy_statement
        )

        L2PMA_homework_submission_bucket = s3.Bucket(
            self, "L2PMAHomeworkSubmissionBucket"
        )
        L2PMA_homework_submission_bucket_policy_statement = aws_iam.PolicyStatement(
            effect=aws_iam.Effect.ALLOW,
            actions=[
                "s3:GetObject",
                "s3:PutObject",
            ],
            resources=[L2PMA_homework_submission_bucket.arn_for_objects("*")],
            principals=[aws_iam.ServicePrincipal("lambda.amazonaws.com")],
        )
        L2PMA_homework_submission_bucket.add_to_resource_policy(
            L2PMA_homework_submission_bucket_policy_statement
        )

        L2PMA_material_attachment_bucket = s3.Bucket(
            self, "L2MPMAMaterialAttachmentBucket"
        )
        L2PMA_material_attachment_bucket_policy_statement = aws_iam.PolicyStatement(
            effect=aws_iam.Effect.ALLOW,
            actions=["s3:GetObject", "s3:PutObject", "s3:DeleteObject"],
            resources=[L2PMA_material_attachment_bucket.arn_for_objects("*")],
            principals=[aws_iam.ServicePrincipal("lambda.amazonaws.com")],
        )
        L2PMA_material_attachment_bucket.add_to_resource_policy(
            L2PMA_material_attachment_bucket_policy_statement
        )

        ###########
        ### IAM ###
        ###########

        # Get existing iam role (lambda-general-role)
        iam = boto3.client("iam")
        general_role = iam.get_role(RoleName="lambda-general-role")
        general_role_arn = general_role["Role"]["Arn"]
        LAMBDA_ROLE = aws_iam.Role.from_role_arn(
            self, "lambda-general-role", general_role_arn
        )
        S3_DYNAMODB_ROLE = aws_iam.Role(
            self,
            "S3DynamodbRole",
            assumed_by=aws_iam.ServicePrincipal("lambda.amazonaws.com"),
        )

        # IAM policies for dynamodb readwrite + s3 readwrite
        dynamodb_policy = aws_iam.PolicyStatement(
            effect=aws_iam.Effect.ALLOW,
            resources=["arn:aws:dynamodb:*:*:table/*"],
            actions=[
                "dynamodb:GetItem",
                "dynamodb:PutItem",
                "dynamodb:Query",
                "dynamodb:UpdateItem",
                "dynamodb:DeleteItem",
            ],
        )
        S3_DYNAMODB_ROLE.add_to_policy(dynamodb_policy)

        s3_policy = aws_iam.PolicyStatement(
            effect=aws_iam.Effect.ALLOW,
            resources=[
                f"{L2PMA_question_image_bucket.bucket_arn}/*",
                f"{L2PMA_homework_submission_bucket.bucket_arn}/*",
                f"{L2PMA_material_attachment_bucket.bucket_arn}/*",
            ],
            actions=["s3:GetObject", "s3:PutObject", "s3:DeleteObject"],
        )
        S3_DYNAMODB_ROLE.add_to_policy(s3_policy)

        AWSLambdaBasicExecutionRole = (
            aws_iam.ManagedPolicy.from_aws_managed_policy_name(
                "service-role/AWSLambdaBasicExecutionRole"
            )
        )
        S3_DYNAMODB_ROLE.add_managed_policy(AWSLambdaBasicExecutionRole)

        ###########
        ### SNS ###
        ###########

        # Create an SNS Topic
        topic = sns.Topic(
            self, "CourseAnnouncementTopic", display_name="CourseAnnouncementTopic"
        )

        ########################
        ### LAMBDA FUNCTIONS ###
        ########################

        # Create /course/homework/ AWS Lambda function
        get_course_homework = _lambda.Function(
            self,
            "getCourseHomework",
            runtime=_lambda.Runtime.PYTHON_3_9,
            handler=f"{COURSE_HOMEWORK_FUNCTIONS_FOLDER}.get_course_homework.lambda_handler",
            code=_lambda.Code.from_asset(FUNCTIONS_FOLDER),
            role=LAMBDA_ROLE,
        )
        post_course_homework = _lambda.Function(
            self,
            "postCourseHomework",
            runtime=_lambda.Runtime.PYTHON_3_9,
            handler=f"{COURSE_HOMEWORK_FUNCTIONS_FOLDER}.post_course_homework.lambda_handler",
            code=_lambda.Code.from_asset(FUNCTIONS_FOLDER),
            role=LAMBDA_ROLE,
        )
        delete_course_homework = _lambda.Function(
            self,
            "deleteCourseHomework",
            runtime=_lambda.Runtime.PYTHON_3_9,
            handler=f"{COURSE_HOMEWORK_FUNCTIONS_FOLDER}.delete_course_homework.lambda_handler",
            code=_lambda.Code.from_asset(FUNCTIONS_FOLDER),
            role=LAMBDA_ROLE,
        )
        put_course_homework = _lambda.Function(
            self,
            "putCourseHomework",
            runtime=_lambda.Runtime.PYTHON_3_9,
            handler=f"{COURSE_HOMEWORK_FUNCTIONS_FOLDER}.put_course_homework.lambda_handler",
            code=_lambda.Code.from_asset(FUNCTIONS_FOLDER),
            role=LAMBDA_ROLE,
        )
        # Create /course/homework/feedback AWS Lambda function
        get_course_homework_feedback = _lambda.Function(
            self,
            "getCourseHomeworkFeedback",
            runtime=_lambda.Runtime.PYTHON_3_9,
            handler=f"{COURSE_HOMEWORK_FUNCTIONS_FOLDER}.get_course_homework_feedback.lambda_handler",
            code=_lambda.Code.from_asset(FUNCTIONS_FOLDER),
            role=S3_DYNAMODB_ROLE,
            environment={
                "HOMEWORK_SUBMISSION_BUCKET_NAME": L2PMA_homework_submission_bucket.bucket_name
            },
        )
        post_course_homework_feedback = _lambda.Function(
            self,
            "postCourseHomeworkFeedback",
            runtime=_lambda.Runtime.PYTHON_3_9,
            handler=f"{COURSE_HOMEWORK_FUNCTIONS_FOLDER}.post_course_homework_feedback.lambda_handler",
            code=_lambda.Code.from_asset(FUNCTIONS_FOLDER),
            role=S3_DYNAMODB_ROLE,
        )

        # /course/homework/submit function
        post_course_homework_submit = _lambda.Function(
            self,
            "postCourseHomeworkSubmit",
            runtime=_lambda.Runtime.PYTHON_3_9,
            handler=f"{COURSE_HOMEWORK_FUNCTIONS_FOLDER}.post_course_homework_submit.lambda_handler",
            code=_lambda.Code.from_asset(FUNCTIONS_FOLDER),
            role=S3_DYNAMODB_ROLE,
            environment={
                "HOMEWORK_SUBMISSION_BUCKET_NAME": L2PMA_homework_submission_bucket.bucket_name
            },
        )

        # /course/announcement Functions
        get_course_announcement = _lambda.Function(
            self,
            "getCourseAnnouncement",
            runtime=_lambda.Runtime.PYTHON_3_9,
            handler=f"{COURSE_ANNOUNCEMENT_FUNCTIONS_FOLDER}.get_course_announcement.lambda_handler",
            code=_lambda.Code.from_asset(FUNCTIONS_FOLDER),
            role=LAMBDA_ROLE,
        )
        post_course_announcement = _lambda.Function(
            self,
            "postCourseAnnouncement",
            runtime=_lambda.Runtime.PYTHON_3_9,
            handler=f"{COURSE_ANNOUNCEMENT_FUNCTIONS_FOLDER}.post_course_announcement.lambda_handler",
            code=_lambda.Code.from_asset(FUNCTIONS_FOLDER),
            role=LAMBDA_ROLE,
            environment={"SNS_TOPIC_ARN": topic.topic_arn},
        )
        delete_course_announcement = _lambda.Function(
            self,
            "deleteCourseAnnouncement",
            runtime=_lambda.Runtime.PYTHON_3_9,
            handler=f"{COURSE_ANNOUNCEMENT_FUNCTIONS_FOLDER}.delete_course_announcement.lambda_handler",
            code=_lambda.Code.from_asset(FUNCTIONS_FOLDER),
            role=LAMBDA_ROLE,
        )
        put_course_announcement = _lambda.Function(
            self,
            "putCourseAnnouncement",
            runtime=_lambda.Runtime.PYTHON_3_9,
            handler=f"{COURSE_ANNOUNCEMENT_FUNCTIONS_FOLDER}.put_course_announcement.lambda_handler",
            code=_lambda.Code.from_asset(FUNCTIONS_FOLDER),
            role=LAMBDA_ROLE,
        )

        # /course Functions
        get_course = _lambda.Function(
            self,
            "getCourse",
            runtime=_lambda.Runtime.PYTHON_3_9,
            handler=f"{COURSE_FUNCTIONS_FOLDER}.get_course.lambda_handler",
            code=_lambda.Code.from_asset(FUNCTIONS_FOLDER),
            role=LAMBDA_ROLE,
        )
        post_course = _lambda.Function(
            self,
            "postCourse",
            runtime=_lambda.Runtime.PYTHON_3_9,
            handler=f"{COURSE_FUNCTIONS_FOLDER}.post_course.lambda_handler",
            code=_lambda.Code.from_asset(FUNCTIONS_FOLDER),
            role=LAMBDA_ROLE,
        )
        put_course = _lambda.Function(
            self,
            "putCourse",
            runtime=_lambda.Runtime.PYTHON_3_9,
            handler=f"{COURSE_FUNCTIONS_FOLDER}.put_course.lambda_handler",
            code=_lambda.Code.from_asset(FUNCTIONS_FOLDER),
            role=LAMBDA_ROLE,
        )
        delete_course = _lambda.Function(
            self,
            "deleteCourse",
            runtime=_lambda.Runtime.PYTHON_3_9,
            handler=f"{COURSE_FUNCTIONS_FOLDER}.delete_course.lambda_handler",
            code=_lambda.Code.from_asset(FUNCTIONS_FOLDER),
            role=LAMBDA_ROLE,
        )

        # /course/student
        get_course_student = _lambda.Function(
            self,
            "getCourseStudent",
            runtime=_lambda.Runtime.PYTHON_3_9,
            handler=f"{COURSE_STUDENT_FUNCTIONS_FOLDER}.get_course_student.lambda_handler",
            code=_lambda.Code.from_asset(FUNCTIONS_FOLDER),
            role=LAMBDA_ROLE,
        )

        # /course/teacher
        get_course_teacher = _lambda.Function(
            self,
            "getCourseTeacher",
            runtime=_lambda.Runtime.PYTHON_3_9,
            handler=f"{COURSE_TEACHER_FUNCTIONS_FOLDER}.get_course_teacher.lambda_handler",
            code=_lambda.Code.from_asset(FUNCTIONS_FOLDER),
            role=LAMBDA_ROLE,
        )

        # /course/material
        get_course_material = _lambda.Function(
            self,
            "get_course_material",
            runtime=_lambda.Runtime.PYTHON_3_9,
            handler=f"{COURSE_MATERIAL_FUNCTIONS_FOLDER}.get_course_material.lambda_handler",
            code=_lambda.Code.from_asset(FUNCTIONS_FOLDER),
            role=S3_DYNAMODB_ROLE,
        )
        post_course_material = _lambda.Function(
            self,
            "post_course_material",
            runtime=_lambda.Runtime.PYTHON_3_9,
            handler=f"{COURSE_MATERIAL_FUNCTIONS_FOLDER}.post_course_material.lambda_handler",
            code=_lambda.Code.from_asset(FUNCTIONS_FOLDER),
            role=S3_DYNAMODB_ROLE,
            environment={
                "MATERIAL_ATTACHMENT_BUCKET_NAME": L2PMA_material_attachment_bucket.bucket_name
            },
        )
        delete_course_material = _lambda.Function(
            self,
            "delete_course_material",
            runtime=_lambda.Runtime.PYTHON_3_9,
            handler=f"{COURSE_MATERIAL_FUNCTIONS_FOLDER}.delete_course_material.lambda_handler",
            code=_lambda.Code.from_asset(FUNCTIONS_FOLDER),
            role=S3_DYNAMODB_ROLE,
            environment={
                "MATERIAL_ATTACHMENT_BUCKET_NAME": L2PMA_material_attachment_bucket.bucket_name
            },
        )
        put_course_material = _lambda.Function(
            self,
            "put_course_material",
            runtime=_lambda.Runtime.PYTHON_3_9,
            handler=f"{COURSE_MATERIAL_FUNCTIONS_FOLDER}.put_course_material.lambda_handler",
            code=_lambda.Code.from_asset(FUNCTIONS_FOLDER),
            role=S3_DYNAMODB_ROLE,
            environment={
                "MATERIAL_ATTACHMENT_BUCKET_NAME": L2PMA_material_attachment_bucket.bucket_name
            },
        )

        # /course/classlist
        get_course_classlist = _lambda.Function(
            self,
            "get_course_classlist",
            runtime=_lambda.Runtime.PYTHON_3_9,
            handler=f"{COURSE_CLASSLIST_FUNCTIONS_FOLDER}.get_course_classlist.lambda_handler",
            code=_lambda.Code.from_asset(FUNCTIONS_FOLDER),
            role=LAMBDA_ROLE,
        )

        # /course/quiz/
        get_course_quiz = _lambda.Function(
            self,
            "getCourseQuiz",
            runtime=_lambda.Runtime.PYTHON_3_9,
            handler=f"{COURSE_QUIZ_FUNCTIONS_FOLDER}.get_course_quiz_withJWT.lambda_handler",
            code=_lambda.Code.from_asset(FUNCTIONS_FOLDER, 
                                        bundling=BundlingOptions(
                                            image=_lambda.Runtime.PYTHON_3_9.bundling_image,
                                            command=[
                                                "bash", "-c",
                                                "pip install --no-cache pyjwt -t /asset-output && cp -au . /asset-output"
                                            ]
                                        )),
            role=LAMBDA_ROLE,
        )

        post_course_quiz = _lambda.Function(
            self,
            "postCourseQuiz",
            runtime=_lambda.Runtime.PYTHON_3_9,
            handler=f"{COURSE_QUIZ_FUNCTIONS_FOLDER}.post_course_quiz.lambda_handler",
            code=_lambda.Code.from_asset(FUNCTIONS_FOLDER),
            role=LAMBDA_ROLE,
        )

        put_course_quiz = _lambda.Function(
            self,
            "putCourseQuiz",
            runtime=_lambda.Runtime.PYTHON_3_9,
            handler=f"{COURSE_QUIZ_FUNCTIONS_FOLDER}.put_course_quiz.lambda_handler",
            code=_lambda.Code.from_asset(FUNCTIONS_FOLDER),
            role=LAMBDA_ROLE,
        )

        delete_course_quiz = _lambda.Function(
            self,
            "deleteCourseQuiz",
            runtime=_lambda.Runtime.PYTHON_3_9,
            handler=f"{COURSE_QUIZ_FUNCTIONS_FOLDER}.delete_course_quiz.lambda_handler",
            code=_lambda.Code.from_asset(FUNCTIONS_FOLDER),
            role=LAMBDA_ROLE,
        )
        # /course/quiz/submit
        post_course_quiz_submit = _lambda.Function(
            self,
            "postCourseQuizSubmit",
            runtime=_lambda.Runtime.NODEJS_16_X,
            handler="post_course_quiz_submit.lambda_handler",
            code=_lambda.Code.from_asset(
                f"{FUNCTIONS_FOLDER}/{COURSE_QUIZ_FUNCTIONS_FOLDER}"
            ),
            role=S3_DYNAMODB_ROLE,
        )
        # /course/quiz/question Functions
        get_course_quiz_question = _lambda.Function(
            self,
            "getCourseQuizQuestion",
            runtime=_lambda.Runtime.PYTHON_3_9,
            handler=f"{COURSE_QUIZ_FUNCTIONS_FOLDER}.get_course_quiz_question.lambda_handler",
            code=_lambda.Code.from_asset(FUNCTIONS_FOLDER),
            role=S3_DYNAMODB_ROLE,
            environment={
                "QUESTION_IMAGE_BUCKET_NAME": L2PMA_question_image_bucket.bucket_name
            },
        )
        post_course_quiz_question = _lambda.Function(
            self,
            "postCourseQuizQuestion",
            runtime=_lambda.Runtime.NODEJS_16_X,
            handler=f"post_course_quiz_question.lambda_handler",
            code=_lambda.Code.from_asset(
                f"{FUNCTIONS_FOLDER}/{COURSE_QUIZ_FUNCTIONS_FOLDER}"
            ),
            role=S3_DYNAMODB_ROLE,
            environment={
                "QUESTION_IMAGE_BUCKET_NAME": L2PMA_question_image_bucket.bucket_name
            },
        )
        delete_course_quiz_question = _lambda.Function(
            self,
            "deleteCourseQuizQuestion",
            runtime=_lambda.Runtime.NODEJS_16_X,
            handler=f"delete_course_quiz_question.lambda_handler",
            code=_lambda.Code.from_asset(
                f"{FUNCTIONS_FOLDER}/{COURSE_QUIZ_FUNCTIONS_FOLDER}"
            ),
            role=S3_DYNAMODB_ROLE,
        )
        put_course_quiz_question = _lambda.Function(
            self,
            "putCourseQuizQuestion",
            runtime=_lambda.Runtime.PYTHON_3_9,
            handler=f"{COURSE_QUIZ_FUNCTIONS_FOLDER}.put_course_quiz_question.lambda_handler",
            code=_lambda.Code.from_asset(FUNCTIONS_FOLDER),
            role=S3_DYNAMODB_ROLE,
            environment={
                "QUESTION_IMAGE_BUCKET_NAME": L2PMA_question_image_bucket.bucket_name
            },
        )

        # /course/report Functions
        get_course_report = _lambda.Function(
            self,
            "getCourseReport",
            runtime=_lambda.Runtime.PYTHON_3_9,
            handler=f"{COURSE_REPORT_FUNCTIONS_FOLDERS}.get_course_report.lambda_handler",
            code=_lambda.Code.from_asset(FUNCTIONS_FOLDER),
            role=S3_DYNAMODB_ROLE,
        )
        post_course_report = _lambda.Function(
            self,
            "postCourseReport",
            runtime=_lambda.Runtime.PYTHON_3_9,
            handler=f"{COURSE_REPORT_FUNCTIONS_FOLDERS}.post_course_report.lambda_handler",
            code=_lambda.Code.from_asset(FUNCTIONS_FOLDER),
            role=S3_DYNAMODB_ROLE,
        )
        put_course_report = _lambda.Function(
            self,
            "putCourseReport",
            runtime=_lambda.Runtime.PYTHON_3_9,
            handler=f"{COURSE_REPORT_FUNCTIONS_FOLDERS}.put_course_report.lambda_handler",
            code=_lambda.Code.from_asset(FUNCTIONS_FOLDER),
            role=S3_DYNAMODB_ROLE,
        )
        delete_course_report = _lambda.Function(
            self,
            "deleteCourseReport",
            runtime=_lambda.Runtime.PYTHON_3_9,
            handler=f"{COURSE_REPORT_FUNCTIONS_FOLDERS}.delete_course_report.lambda_handler",
            code=_lambda.Code.from_asset(FUNCTIONS_FOLDER),
            role=S3_DYNAMODB_ROLE,
        )

        ##############
        ### API GW ###
        ##############

        # Create Amazon API Gateway REST API
        main_api = apigw.RestApi(self, "main", description="All LMS APIs")
        self.main_api = main_api

        ##########################
        ### API GW - RESOURCES ###
        ##########################

        # Create resources for the API
        course_resource = main_api.root.add_resource("course")

        # Create sub-resources under the parent resource
        course_student_resource = course_resource.add_resource("student")
        course_teacher_resource = course_resource.add_resource("teacher")
        course_quiz_resource = course_resource.add_resource("quiz")
        course_homework_resource = course_resource.add_resource("homework")
        course_announcement_resource = course_resource.add_resource("announcement")
        course_material_resource = course_resource.add_resource("material")
        course_classlist_resource = course_resource.add_resource("classlist")
        course_report_resource = course_resource.add_resource("report")

        # Create sub-sub-resources under the parent resource
        course_quiz_question_resource = course_quiz_resource.add_resource("question")
        course_quiz_submit_resource = course_quiz_resource.add_resource("submit")
        course_homework_feedback_resource = course_homework_resource.add_resource(
            "feedback"
        )
        course_homework_submit_resource = course_homework_resource.add_resource(
            "submit"
        )

        ########################
        ### API GW - METHODS ###
        ########################

        # Create methods in the required resources

        # /course
        # Define a JSON Schema to accept Request Body in JSON format for POST Method
        post_course_model = main_api.add_model(
            "PostCourseModel1",
            content_type="application/json",
            model_name="PostCourseModel1",
            schema=apigw.JsonSchema(
                title="PostCourseModel1",
                schema=apigw.JsonSchemaVersion.DRAFT4,
                type=apigw.JsonSchemaType.OBJECT,
                properties={
                    "courseName": apigw.JsonSchema(type=apigw.JsonSchemaType.STRING),
                    "courseSlot": apigw.JsonSchema(type=apigw.JsonSchemaType.STRING),
                    "teacherId": apigw.JsonSchema(type=apigw.JsonSchemaType.STRING),
                },
                required=["courseName", "courseSlot", "teacherId"],
            ),
        )

        put_course_model = main_api.add_model(
            "PutCourseModel",
            content_type="application/json",
            model_name="PutCourseModel",
            schema=apigw.JsonSchema(
                title="PutCourseModel",
                schema=apigw.JsonSchemaVersion.DRAFT4,
                type=apigw.JsonSchemaType.OBJECT,
                properties={
                    "courseName": apigw.JsonSchema(type=apigw.JsonSchemaType.STRING),
                    "courseSlot": apigw.JsonSchema(type=apigw.JsonSchemaType.STRING),
                    "courseId": apigw.JsonSchema(type=apigw.JsonSchemaType.STRING),
                    "teacherId": apigw.JsonSchema(type=apigw.JsonSchemaType.STRING),
                },
                required=["courseId"],
            ),
        )

        course_resource.add_method(
            "GET",
            apigw.LambdaIntegration(get_course),
            request_parameters={"method.request.querystring.courseId": False},
        )
        course_resource.add_method(
            "DELETE",
            apigw.LambdaIntegration(delete_course),
            request_parameters={"method.request.querystring.courseId": True},
        )
        course_resource.add_method(
            "POST",
            apigw.LambdaIntegration(post_course),
            request_models={"application/json": post_course_model},
        )
        course_resource.add_method(
            "PUT",
            apigw.LambdaIntegration(put_course),
            request_models={"application/json": put_course_model},
        )

        # /course/student
        course_student_resource.add_method(
            "GET",
            apigw.LambdaIntegration(get_course_student),
            request_parameters={
                "method.request.querystring.courseId": True,
                "method.request.querystring.studentId": False,
            },
        )

        # /course/teacher
        course_teacher_resource.add_method(
            "GET",
            apigw.LambdaIntegration(get_course_teacher),
            request_parameters={"method.request.querystring.courseId": True},
        )

        # /course/material
        # Define a JSON Schema to accept Request Body in JSON format for POST Method
        post_course_material_model = main_api.add_model(
            "PostCourseMaterialModel",
            content_type="application/json",
            model_name="PostCourseMaterialModel",
            schema=apigw.JsonSchema(
                title="PostCourseMaterialModel",
                schema=apigw.JsonSchemaVersion.DRAFT4,
                type=apigw.JsonSchemaType.OBJECT,
                properties={
                    "courseId": apigw.JsonSchema(type=apigw.JsonSchemaType.STRING),
                    "materialTitle": apigw.JsonSchema(type=apigw.JsonSchemaType.STRING),
                    "materialType": apigw.JsonSchema(type=apigw.JsonSchemaType.STRING),
                    "materialLessonDate": apigw.JsonSchema(
                        type=apigw.JsonSchemaType.STRING
                    ),
                    "materialLink": apigw.JsonSchema(type=apigw.JsonSchemaType.STRING),
                    "materialAttachmentFileName": apigw.JsonSchema(
                        type=apigw.JsonSchemaType.STRING
                    ),
                },
                required=[
                    "courseId",
                    "materialTitle",
                    "materialType",
                    "materialLessonDate",
                ],
            ),
        )

        put_course_material_model = main_api.add_model(
            "PutCourseMaterialModel",
            content_type="application/json",
            model_name="PutCourseMaterialModel",
            schema=apigw.JsonSchema(
                title="PutCourseMaterialModel",
                schema=apigw.JsonSchemaVersion.DRAFT4,
                type=apigw.JsonSchemaType.OBJECT,
                properties={
                    "courseId": apigw.JsonSchema(type=apigw.JsonSchemaType.STRING),
                    "materialId": apigw.JsonSchema(type=apigw.JsonSchemaType.STRING),
                    "materialTitle": apigw.JsonSchema(type=apigw.JsonSchemaType.STRING),
                    "materialType": apigw.JsonSchema(type=apigw.JsonSchemaType.STRING),
                    "materialLessonDate": apigw.JsonSchema(
                        type=apigw.JsonSchemaType.STRING
                    ),
                    "materialLink": apigw.JsonSchema(type=apigw.JsonSchemaType.STRING),
                    "materialS3Link": apigw.JsonSchema(
                        type=apigw.JsonSchemaType.STRING
                    ),
                    "materialAttachmentFileName": apigw.JsonSchema(
                        type=apigw.JsonSchemaType.STRING
                    ),
                },
                required=[
                    "courseId",
                    "materialId",
                    "materialTitle",
                    "materialLessonDate",
                ],
            ),
        )

        course_material_resource.add_method(
            "GET",
            apigw.LambdaIntegration(get_course_material),
            request_parameters={
                "method.request.querystring.courseId": True,
                "method.request.querystring.materialId": False,
            },
        )
        course_material_resource.add_method(
            "DELETE",
            apigw.LambdaIntegration(delete_course_material),
            request_parameters={
                "method.request.querystring.courseId": True,
                "method.request.querystring.materialId": True,
            },
        )
        course_material_resource.add_method(
            "POST",
            apigw.LambdaIntegration(post_course_material),
            request_models={"application/json": post_course_material_model},
        )
        course_material_resource.add_method(
            "PUT",
            apigw.LambdaIntegration(put_course_material),
            request_models={"application/json": put_course_material_model},
        )

        # /course/classlist
        course_classlist_resource.add_method(
            "GET",
            apigw.LambdaIntegration(get_course_classlist),
            request_parameters={"method.request.querystring.courseId": True},
        )

        # /course/quiz
        post_course_quiz_model = main_api.add_model(
            "PostCourseQuizModel",
            content_type="application/json",
            model_name="PostCourseQuizModel",
            schema=apigw.JsonSchema(
                title="PostCourseQuizModel",
                schema=apigw.JsonSchemaVersion.DRAFT4,
                type=apigw.JsonSchemaType.OBJECT,
                properties={
                    "courseId": apigw.JsonSchema(type=apigw.JsonSchemaType.STRING),
                    "quizTitle": apigw.JsonSchema(type=apigw.JsonSchemaType.STRING),
                    "quizMaxAttempts": apigw.JsonSchema(
                        type=apigw.JsonSchemaType.INTEGER
                    ),
                    "quizDescription": apigw.JsonSchema(
                        type=apigw.JsonSchemaType.STRING
                    ),
                    "visibility": apigw.JsonSchema(type=apigw.JsonSchemaType.BOOLEAN),
                },
                required=["courseId", "quizTitle", "quizMaxAttempts", "visibility"],
            ),
        )

        put_course_quiz_model = main_api.add_model(
            "PutCourseQuizModel",
            content_type="application/json",
            model_name="PutCourseQuizModel",
            schema=apigw.JsonSchema(
                title="PutCourseQuizModel",
                schema=apigw.JsonSchemaVersion.DRAFT4,
                type=apigw.JsonSchemaType.OBJECT,
                properties={
                    "courseId": apigw.JsonSchema(type=apigw.JsonSchemaType.STRING),
                    "quizTitle": apigw.JsonSchema(type=apigw.JsonSchemaType.STRING),
                    "quizId": apigw.JsonSchema(type=apigw.JsonSchemaType.STRING),
                    "quizMaxAttempts": apigw.JsonSchema(
                        type=apigw.JsonSchemaType.INTEGER
                    ),
                    "quizDescription": apigw.JsonSchema(
                        type=apigw.JsonSchemaType.STRING
                    ),
                    "visibility": apigw.JsonSchema(type=apigw.JsonSchemaType.BOOLEAN),
                },
                required=["courseId", "quizId", "quizTitle", "quizMaxAttempts", "quizDescription", "visibility"],
            ),
        )

        delete_course_quiz_model = main_api.add_model(
            "DeleteCourseQuizModel",
            content_type="application/json",
            model_name="DeleteCourseQuizModel",
            schema=apigw.JsonSchema(
                title="DeleteCourseQuizModel",
                schema=apigw.JsonSchemaVersion.DRAFT4,
                type=apigw.JsonSchemaType.OBJECT,
                properties={
                    "courseId": apigw.JsonSchema(type=apigw.JsonSchemaType.STRING),
                    "quizId": apigw.JsonSchema(type=apigw.JsonSchemaType.STRING),
                },
                required=["courseId", "quizId"],
            ),
        )

        course_quiz_resource.add_method(
            "POST",
            apigw.LambdaIntegration(post_course_quiz),
            request_models={"application/json": post_course_quiz_model},
        )
        course_quiz_resource.add_method(
            "PUT",
            apigw.LambdaIntegration(put_course_quiz),
            request_models={"application/json": put_course_quiz_model},
        )
        course_quiz_resource.add_method(
            "DELETE",
            apigw.LambdaIntegration(delete_course_quiz),
            request_models={"application/json": delete_course_quiz_model},
        )
        course_quiz_resource.add_method(
            "GET",
            apigw.LambdaIntegration(get_course_quiz),
            request_parameters={
                "method.request.querystring.courseId": True,
                "method.request.querystring.studentId": False,
                "method.request.querystring.quizId": False,
            },
        )

        # /course/quiz/question
        post_course_quiz_question_model = main_api.add_model(
            "PostCourseQuizQuestionModel",
            content_type="application/json",
            model_name="PostCourseQuizQuestionModel",
            schema=apigw.JsonSchema(
                title="PostCourseQuizQuestionModel",
                schema=apigw.JsonSchemaVersion.DRAFT4,
                type=apigw.JsonSchemaType.OBJECT,
                properties={
                    "courseId": apigw.JsonSchema(type=apigw.JsonSchemaType.STRING),
                    "quizId": apigw.JsonSchema(type=apigw.JsonSchemaType.STRING),
                    "questionOptionType": apigw.JsonSchema(
                        type=apigw.JsonSchemaType.STRING
                    ),
                    "question": apigw.JsonSchema(type=apigw.JsonSchemaType.STRING),
                    "options": apigw.JsonSchema(type=apigw.JsonSchemaType.ARRAY),
                    "answer": apigw.JsonSchema(type=apigw.JsonSchemaType.STRING),
                    "questionImage": apigw.JsonSchema(type=apigw.JsonSchemaType.STRING),
                },
                required=["courseId", "quizId", "question", "options", "answer"],
            ),
        )

        delete_course_quiz_question_model = main_api.add_model(
            "DeleteCourseQuizQuestionModel",
            content_type="application/json",
            model_name="DeleteCourseQuizQuestionModel",
            schema=apigw.JsonSchema(
                title="DeleteCourseQuizQuestionModel",
                schema=apigw.JsonSchemaVersion.DRAFT4,
                type=apigw.JsonSchemaType.OBJECT,
                properties={
                    "courseId": apigw.JsonSchema(type=apigw.JsonSchemaType.STRING),
                    "quizId": apigw.JsonSchema(type=apigw.JsonSchemaType.STRING),
                    "questionId": apigw.JsonSchema(type=apigw.JsonSchemaType.STRING),
                    "question": apigw.JsonSchema(type=apigw.JsonSchemaType.STRING),
                    "options": apigw.JsonSchema(type=apigw.JsonSchemaType.ARRAY),
                    "answer": apigw.JsonSchema(type=apigw.JsonSchemaType.STRING),
                    "questionImage": apigw.JsonSchema(type=apigw.JsonSchemaType.STRING),
                    "questionOptionType": apigw.JsonSchema(
                        type=apigw.JsonSchemaType.STRING
                    ),

                },
                required=["courseId", "quizId", "questionId"],
            ),
        )
        put_course_quiz_question_model = main_api.add_model(
            "PutCourseQuizQuestionModel",
            content_type="application/json",
            model_name="PutCourseQuizQuestionModel",
            schema=apigw.JsonSchema(
                title="PutCourseQuizQuestionModel",
                schema=apigw.JsonSchemaVersion.DRAFT4,
                type=apigw.JsonSchemaType.OBJECT,
                properties={
                    "courseId": apigw.JsonSchema(type=apigw.JsonSchemaType.STRING),
                    "quizId": apigw.JsonSchema(type=apigw.JsonSchemaType.STRING),
                    "questionId": apigw.JsonSchema(type=apigw.JsonSchemaType.STRING),
                },
                required=["courseId", "quizId", "questionId"],
            ),
        )

        course_quiz_question_resource.add_method(
            "GET",
            apigw.LambdaIntegration(get_course_quiz_question),
            request_parameters={
                "method.request.querystring.courseId": True,
                "method.request.querystring.quizId": True,
                "method.request.querystring.questionId": False,
            },
        )
        course_quiz_question_resource.add_method(
            "DELETE",
            apigw.LambdaIntegration(delete_course_quiz_question),
            request_models={"application/json": delete_course_quiz_question_model},
        )
        course_quiz_question_resource.add_method(
            "POST",
            apigw.LambdaIntegration(post_course_quiz_question),
            request_models={"application/json": post_course_quiz_question_model},
        )
        course_quiz_question_resource.add_method(
            "PUT",
            apigw.LambdaIntegration(put_course_quiz_question),
            request_models={"application/json": put_course_quiz_question_model},
        )
        # /course/quiz/question/submit
        post_course_quiz_submit_resource_model = main_api.add_model(
            "PostCourseQuizSubmitModel",
            content_type="application/json",
            model_name="PostCourseQuizSubmitModel",
            schema=apigw.JsonSchema(
                title="PostCourseQuizSubmitModel",
                schema=apigw.JsonSchemaVersion.DRAFT4,
                type=apigw.JsonSchemaType.OBJECT,
                properties={
                    "courseId": apigw.JsonSchema(type=apigw.JsonSchemaType.STRING),
                    "studentId": apigw.JsonSchema(type=apigw.JsonSchemaType.STRING),
                    "quizScore": apigw.JsonSchema(type=apigw.JsonSchemaType.NUMBER),
                    "quizId": apigw.JsonSchema(type=apigw.JsonSchemaType.STRING),
                },
                required=["courseId", "quizId", "studentId", "quizScore"],
            ),
        )

        course_quiz_submit_resource.add_method(
            "POST",
            apigw.LambdaIntegration(post_course_quiz_submit),
            request_models={"application/json": post_course_quiz_submit_resource_model},
        )

        # /course/homework
        post_course_homework_resource_model = main_api.add_model(
            "PostCourseHomeworkModel",
            content_type="application/json",
            model_name="PostCourseHomeworkModel",
            schema=apigw.JsonSchema(
                title="PostCourseHomeworkModel",
                schema=apigw.JsonSchemaVersion.DRAFT4,
                type=apigw.JsonSchemaType.OBJECT,
                properties={
                    "courseId": apigw.JsonSchema(type=apigw.JsonSchemaType.STRING),
                    "homeworkTitle": apigw.JsonSchema(type=apigw.JsonSchemaType.STRING),
                    "homeworkDueDate": apigw.JsonSchema(
                        type=apigw.JsonSchemaType.STRING
                    ),
                    "homeworkAssignedDate": apigw.JsonSchema(
                        type=apigw.JsonSchemaType.STRING
                    ),
                    "homeworkDescription": apigw.JsonSchema(
                        type=apigw.JsonSchemaType.STRING
                    ),
                },
                required=["courseId", "homeworkTitle", "homeworkDueDate"],
            ),
        )

        delete_course_homework_resource_model = main_api.add_model(
            "DeleteCourseHomeworkModel",
            content_type="application/json",
            model_name="DeleteCourseHomeworkModel",
            schema=apigw.JsonSchema(
                title="DeleteCourseHomeworkModel",
                schema=apigw.JsonSchemaVersion.DRAFT4,
                type=apigw.JsonSchemaType.OBJECT,
                properties={
                    "courseId": apigw.JsonSchema(type=apigw.JsonSchemaType.STRING),
                    "homeworkId": apigw.JsonSchema(type=apigw.JsonSchemaType.STRING),
                },
                required=["courseId", "homeworkId"],
            ),
        )
        put_course_homework_resource_model = main_api.add_model(
            "PutCourseHomeworkModel",
            content_type="application/json",
            model_name="PutCourseHomeworkModel",
            schema=apigw.JsonSchema(
                title="PutCourseHomeworkModel",
                schema=apigw.JsonSchemaVersion.DRAFT4,
                type=apigw.JsonSchemaType.OBJECT,
                properties={
                    "courseId": apigw.JsonSchema(type=apigw.JsonSchemaType.STRING),
                    "homeworkId": apigw.JsonSchema(type=apigw.JsonSchemaType.STRING),
                },
                required=[
                    "courseId",
                    "homeworkId",
                    "homeworkTitle",
                    "homeworkDueDate",
                    "homeworkDescription",
                ],
            ),
        )

        course_homework_resource.add_method(
            "POST",
            apigw.LambdaIntegration(post_course_homework),
            request_models={"application/json": post_course_homework_resource_model},
        )
        course_homework_resource.add_method(
            "GET",
            apigw.LambdaIntegration(get_course_homework),
            request_parameters={
                "method.request.querystring.courseId": True,
                "method.request.querystring.homeworkId": False,
            },
        )
        course_homework_resource.add_method(
            "PUT",
            apigw.LambdaIntegration(put_course_homework),
            request_models={"application/json": put_course_homework_resource_model},
        )
        course_homework_resource.add_method(
            "DELETE",
            apigw.LambdaIntegration(delete_course_homework),
            request_models={"application/json": delete_course_homework_resource_model},
        )

        # /course/homework/feedback
        course_homework_feedback_resource.add_method(
            "GET",
            apigw.LambdaIntegration(get_course_homework_feedback),
            request_parameters={
                "method.request.querystring.courseId": True,
                "method.request.querystring.studentId": False,
                "method.request.querystring.homeworkId": False,
            },
        )
        post_course_homework_feedback_resource_model = main_api.add_model(
            "PostCourseHomeworkFeedbackModel",
            content_type="application/json",
            model_name="PostCourseHomeworkFeedbackModel",
            schema=apigw.JsonSchema(
                title="PostCourseHomeworkFeedbackModel",
                schema=apigw.JsonSchemaVersion.DRAFT4,
                type=apigw.JsonSchemaType.OBJECT,
                properties={
                    "courseId": apigw.JsonSchema(type=apigw.JsonSchemaType.STRING),
                    "studentId": apigw.JsonSchema(type=apigw.JsonSchemaType.STRING),
                    "homeworkId": apigw.JsonSchema(type=apigw.JsonSchemaType.STRING),
                    "homeworkScore": apigw.JsonSchema(type=apigw.JsonSchemaType.NUMBER),
                    "teacherComments": apigw.JsonSchema(type=apigw.JsonSchemaType.STRING),
                },
                required=["courseId", "studentId", "homeworkId", "homeworkScore"],
            ),
        )
        course_homework_feedback_resource.add_method(
            "POST",
            apigw.LambdaIntegration(post_course_homework_feedback),
            request_models={
                "application/json": post_course_homework_feedback_resource_model
            },
        )

        # /course/homework/submit
        post_course_homework_submit_resource_model = main_api.add_model(
            "PostCourseHomeworkSubmitModel",
            content_type="application/json",
            model_name="PostCourseHomeworkSubmitModel",
            schema=apigw.JsonSchema(
                title="PostCourseHomeworkSubmitModel",
                schema=apigw.JsonSchemaVersion.DRAFT4,
                type=apigw.JsonSchemaType.OBJECT,
                properties={
                    "courseId": apigw.JsonSchema(type=apigw.JsonSchemaType.STRING),
                    "studentId": apigw.JsonSchema(type=apigw.JsonSchemaType.STRING),
                    "homeworkId": apigw.JsonSchema(type=apigw.JsonSchemaType.STRING),
                },
                required=["courseId", "studentId", "homeworkId"],
            ),
        )

        course_homework_submit_resource.add_method(
            "POST",
            apigw.LambdaIntegration(post_course_homework_submit),
            request_models={
                "application/json": post_course_homework_submit_resource_model
            },
        )

        # /course/announcement
        # Define a JSON Schema to accept Request Body in JSON format for POST Method
        post_course_announcement_model = main_api.add_model(
            "PostCourseAnnouncementModel",
            content_type="application/json",
            model_name="PostCourseAnnouncementModel",
            schema=apigw.JsonSchema(
                title="PostCourseAnnouncementModel",
                schema=apigw.JsonSchemaVersion.DRAFT4,
                type=apigw.JsonSchemaType.OBJECT,
                properties={
                    "courseId": apigw.JsonSchema(type=apigw.JsonSchemaType.STRING),
                    "content": apigw.JsonSchema(type=apigw.JsonSchemaType.STRING),
                    "title": apigw.JsonSchema(type=apigw.JsonSchemaType.STRING),
                },
                required=["content"],
            ),
        )

        put_course_announcement_model = main_api.add_model(
            "PutCourseAnnouncementModel",
            content_type="application/json",
            model_name="PutCourseAnnouncementModel",
            schema=apigw.JsonSchema(
                title="PutCourseAnnouncementModel",
                schema=apigw.JsonSchemaVersion.DRAFT4,
                type=apigw.JsonSchemaType.OBJECT,
                properties={
                    "courseId": apigw.JsonSchema(type=apigw.JsonSchemaType.STRING),
                    "announcementId": apigw.JsonSchema(
                        type=apigw.JsonSchemaType.STRING
                    ),
                    "content": apigw.JsonSchema(type=apigw.JsonSchemaType.STRING),
                    "title": apigw.JsonSchema(type=apigw.JsonSchemaType.STRING),
                },
                required=["courseId", "announcementId", "title", "content"],
            ),
        )

        course_announcement_resource.add_method(
            "GET",
            apigw.LambdaIntegration(get_course_announcement),
            request_parameters={
                "method.request.querystring.courseId": True,
                "method.request.querystring.announcementId": False,
            },
        )
        course_announcement_resource.add_method(
            "DELETE",
            apigw.LambdaIntegration(delete_course_announcement),
            request_parameters={
                "method.request.querystring.courseId": True,
                "method.request.querystring.announcementId": True,
            },
        )
        course_announcement_resource.add_method(
            "POST",
            apigw.LambdaIntegration(post_course_announcement),
            request_models={"application/json": post_course_announcement_model},
        )
        course_announcement_resource.add_method(
            "PUT",
            apigw.LambdaIntegration(put_course_announcement),
            request_models={"application/json": put_course_announcement_model},
        )

        # /course/report
        REPORT_EVALUATIONLIST_ENUM = [
            "Good",
            "Excellent",
            "Satisfactory",
            "N.A.",
            "Weak",
            "Poor",
        ]
        put_course_report_model = main_api.add_model(
            "PutCourseReportModel",
            content_type="application/json",
            model_name="PutCourseReportModel",
            schema=apigw.JsonSchema(
                title="PutCourseReportModel",
                schema=apigw.JsonSchemaVersion.DRAFT4,
                type=apigw.JsonSchemaType.OBJECT,
                properties={
                    "courseId": apigw.JsonSchema(type=apigw.JsonSchemaType.STRING),
                    "studentId": apigw.JsonSchema(type=apigw.JsonSchemaType.STRING),
                    "reportId": apigw.JsonSchema(type=apigw.JsonSchemaType.STRING),
                    "additionalComments": apigw.JsonSchema(
                        type=apigw.JsonSchemaType.STRING
                    ),
                    "goalsForNewTerm": apigw.JsonSchema(
                        type=apigw.JsonSchemaType.STRING
                    ),
                    "availableDate": apigw.JsonSchema(type=apigw.JsonSchemaType.STRING),
                    "updatedDate": apigw.JsonSchema(type=apigw.JsonSchemaType.STRING),
                    "evaluationList": apigw.JsonSchema(
                        type=apigw.JsonSchemaType.OBJECT,
                        properties={
                            "attendance": apigw.JsonSchema(
                                type=apigw.JsonSchemaType.STRING,
                                enum=REPORT_EVALUATIONLIST_ENUM,
                            ),
                            "dynamicsControl": apigw.JsonSchema(
                                type=apigw.JsonSchemaType.STRING,
                                enum=REPORT_EVALUATIONLIST_ENUM,
                            ),
                            "punctuality": apigw.JsonSchema(
                                type=apigw.JsonSchemaType.STRING,
                                enum=REPORT_EVALUATIONLIST_ENUM,
                            ),
                            "toneQuality": apigw.JsonSchema(
                                type=apigw.JsonSchemaType.STRING,
                                enum=REPORT_EVALUATIONLIST_ENUM,
                            ),
                            "theory": apigw.JsonSchema(
                                type=apigw.JsonSchemaType.STRING,
                                enum=REPORT_EVALUATIONLIST_ENUM,
                            ),
                            "enthusiasm": apigw.JsonSchema(
                                type=apigw.JsonSchemaType.STRING,
                                enum=REPORT_EVALUATIONLIST_ENUM,
                            ),
                            "rhythm": apigw.JsonSchema(
                                type=apigw.JsonSchemaType.STRING,
                                enum=REPORT_EVALUATIONLIST_ENUM,
                            ),
                            "scales": apigw.JsonSchema(
                                type=apigw.JsonSchemaType.STRING,
                                enum=REPORT_EVALUATIONLIST_ENUM,
                            ),
                            "posture": apigw.JsonSchema(
                                type=apigw.JsonSchemaType.STRING,
                                enum=REPORT_EVALUATIONLIST_ENUM,
                            ),
                            "articulation": apigw.JsonSchema(
                                type=apigw.JsonSchemaType.STRING,
                                enum=REPORT_EVALUATIONLIST_ENUM,
                            ),
                            "musicality": apigw.JsonSchema(
                                type=apigw.JsonSchemaType.STRING,
                                enum=REPORT_EVALUATIONLIST_ENUM,
                            ),
                            "sightReading": apigw.JsonSchema(
                                type=apigw.JsonSchemaType.STRING,
                                enum=REPORT_EVALUATIONLIST_ENUM,
                            ),
                            "practice": apigw.JsonSchema(
                                type=apigw.JsonSchemaType.STRING,
                                enum=REPORT_EVALUATIONLIST_ENUM,
                            ),
                            "aural": apigw.JsonSchema(
                                type=apigw.JsonSchemaType.STRING,
                                enum=REPORT_EVALUATIONLIST_ENUM,
                            ),
                            "performing": apigw.JsonSchema(
                                type=apigw.JsonSchemaType.STRING,
                                enum=REPORT_EVALUATIONLIST_ENUM,
                            ),
                        },
                    ),
                },
                required=["courseId", "studentId", "reportId", "evaluationList"],
            ),
        )

        course_report_resource.add_method(
            "GET",
            apigw.LambdaIntegration(get_course_report),
            request_parameters={
                "method.request.querystring.courseId": True,
                "method.request.querystring.studentId": True,
                "method.request.querystring.reportId": False,
            },
        )
        course_report_resource.add_method(
            "POST",
            apigw.LambdaIntegration(post_course_report),
            request_parameters={
                "method.request.querystring.courseId": True,
                "method.request.querystring.studentId": True,
                "method.request.querystring.availableDate": True,
            },
        )
        course_report_resource.add_method(
            "PUT",
            apigw.LambdaIntegration(put_course_report),
            request_models={"application/json": put_course_report_model},
        )
        course_report_resource.add_method(
            "DELETE",
            apigw.LambdaIntegration(delete_course_report),
            request_parameters={
                "method.request.querystring.courseId": True,
                "method.request.querystring.studentId": True,
                "method.request.querystring.reportId": False,
            },
        )

        ############
        ### CORS ###
        ############

        # Enable CORS for each resource/sub-resource etc.
        course_resource.add_cors_preflight(
            allow_origins=["*"],
            allow_methods=["GET", "POST", "DELETE", "PUT"],
            status_code=200,
        )
        course_student_resource.add_cors_preflight(
            allow_origins=["*"],
            allow_methods=["GET", "POST", "DELETE", "PUT"],
            status_code=200,
        )
        course_teacher_resource.add_cors_preflight(
            allow_origins=["*"],
            allow_methods=["GET", "POST", "DELETE", "PUT"],
            status_code=200,
        )
        course_quiz_resource.add_cors_preflight(
            allow_origins=["*"],
            allow_methods=["GET", "PUT", "DELETE", "PUT"],
            status_code=200,
        )
        course_quiz_submit_resource.add_cors_preflight(
            allow_origins=["*"],
            allow_methods=["GET", "POST", "DELETE", "PUT"],
            status_code=200,
        )
        course_homework_resource.add_cors_preflight(
            allow_origins=["*"],
            allow_methods=["GET", "POST", "DELETE", "PUT"],
            status_code=200,
        )
        course_homework_feedback_resource.add_cors_preflight(
            allow_origins=["*"],
            allow_methods=["GET", "POST", "DELETE", "PUT"],
            status_code=200,
        )
        course_homework_submit_resource.add_cors_preflight(
            allow_origins=["*"],
            allow_methods=["GET", "POST", "DELETE", "PUT"],
            status_code=200,
        )
        course_quiz_question_resource.add_cors_preflight(
            allow_origins=["*"],
            allow_methods=["GET", "POST", "DELETE", "PUT"],
            status_code=200,
        )
        course_material_resource.add_cors_preflight(
            allow_origins=["*"],
            allow_methods=["GET", "POST", "DELETE", "PUT"],
            status_code=200,
        )
        course_announcement_resource.add_cors_preflight(
            allow_origins=["*"],
            allow_methods=["GET", "POST", "DELETE", "PUT"],
            status_code=200,
        )
        course_classlist_resource.add_cors_preflight(
            allow_origins=["*"],
            allow_methods=["GET", "POST", "DELETE", "PUT"],
            status_code=200,
        )
        course_report_resource.add_cors_preflight(
            allow_origins=["*"],
            allow_methods=["GET", "POST", "DELETE", "PUT"],
            status_code=200,
        )

        ######################
        ### EXPORT OUTPUTS ###
        ######################

        # Export API gateway to use in other Stacks
        CfnOutput(
            self,
            "MyApiIdOutput",
            value=main_api.rest_api_id,
            export_name="mainApiId",
        )
        CfnOutput(
            self,
            "MyApiRootResourceIdOutput",
            value=main_api.root.resource_id,
            export_name="mainApiRootResourceIdOutput",
        )
