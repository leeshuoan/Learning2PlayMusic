import boto3

from aws_cdk import (
    aws_lambda as _lambda,
    aws_apigateway as apigw,
    aws_iam,
    Stack,
    CfnOutput
)

from constructs import Construct


class CourseStack(Stack):

    def __init__(self, scope: Construct, construct_id: str, **kwargs) -> None:
        super().__init__(scope, construct_id, **kwargs)

        # The code that defines your stack goes here

        # Define Constants Here
        FUNCTIONS_FOLDER = "./lambda_functions/"
        COURSE_FUNCTIONS_FOLDER = FUNCTIONS_FOLDER+"course/"
        COURSE_MATERIAL_FUNCTIONS_FOLDER = FUNCTIONS_FOLDER+"course/course_material"
        COURSE_HOMEWORK_FUNCTIONS_FOLDER = FUNCTIONS_FOLDER+"course_homework/"
        COURSE_QUIZ_FUNCTIONS_FOLDER = FUNCTIONS_FOLDER+"course_quiz/"
        COURSE_ANNOUNCEMENT_FUNCTIONS_FOLDER = FUNCTIONS_FOLDER + "course_announcement/"

        # Get existing iam role (lambda-general-role)
        iam = boto3.client("iam")
        role = iam.get_role(RoleName="lambda-general-role")
        role_arn = role["Role"]["Arn"]
        LAMBDA_ROLE = aws_iam.Role.from_role_arn(
            self, "lambda-general-role", role_arn)

        # Create getCourseHomework AWS Lambda function
        get_course_homework = _lambda.Function(self, "getCourseHomework", runtime=_lambda.Runtime.PYTHON_3_9,
                                               handler="get_course_homework.lambda_handler", code=_lambda.Code.from_asset(COURSE_HOMEWORK_FUNCTIONS_FOLDER), role=LAMBDA_ROLE)

        # /course/announcement Functions
        get_course_announcement = _lambda.Function(self, "getCourseAnnouncement",  runtime=_lambda.Runtime.PYTHON_3_9,
                                                   handler="get_course_announcement.lambda_handler", code=_lambda.Code.from_asset(COURSE_ANNOUNCEMENT_FUNCTIONS_FOLDER), role=LAMBDA_ROLE)
        post_course_announcement = _lambda.Function(self, "postCourseAnnouncement", runtime=_lambda.Runtime.PYTHON_3_9,
                                                    handler="post_course_announcement.lambda_handler", code=_lambda.Code.from_asset(COURSE_ANNOUNCEMENT_FUNCTIONS_FOLDER), role=LAMBDA_ROLE)
        delete_course_announcement = _lambda.Function(self, "deleteCourseAnnouncement", runtime=_lambda.Runtime.PYTHON_3_9,
                                                      handler="delete_course_announcement.lambda_handler", code=_lambda.Code.from_asset(COURSE_ANNOUNCEMENT_FUNCTIONS_FOLDER), role=LAMBDA_ROLE)

        # /course Functions
        get_course = _lambda.Function(self, "getCourse", runtime=_lambda.Runtime.PYTHON_3_9, handler=f"{COURSE_FUNCTIONS_FOLDER}.get_course.lambda_handler", code=_lambda.Code.from_asset(FUNCTIONS_FOLDER), role=LAMBDA_ROLE)
        post_course = _lambda.Function(self, "postCourse", runtime=_lambda.Runtime.PYTHON_3_9, handler=f"{COURSE_FUNCTIONS_FOLDER}.post_course.lambda_handler", code=_lambda.Code.from_asset(FUNCTIONS_FOLDER), role=LAMBDA_ROLE)
        delete_course = _lambda.Function(self, "deleteCourse", runtime=_lambda.Runtime.PYTHON_3_9, handler=f"{COURSE_FUNCTIONS_FOLDER}.delete_course.lambda_handler", code=_lambda.Code.from_asset(FUNCTIONS_FOLDER), role=LAMBDA_ROLE)
        

        # # /course/material Functions
        get_course_material = _lambda.Function(self, "get_course_material", runtime=_lambda.Runtime.PYTHON_3_9, handler=f"{COURSE_MATERIAL_FUNCTIONS_FOLDER}.get_course_material.lambda_handler", code=_lambda.Code.from_asset(FUNCTIONS_FOLDER), role=LAMBDA_ROLE)
        post_course_material = _lambda.Function(self, "post_course_material", runtime=_lambda.Runtime.PYTHON_3_9, handler=f"{COURSE_MATERIAL_FUNCTIONS_FOLDER}.post_course_material.lambda_handler", code=_lambda.Code.from_asset(FUNCTIONS_FOLDER), role=LAMBDA_ROLE)
        delete_course_material = _lambda.Function(self, "delete_course_material", runtime=_lambda.Runtime.PYTHON_3_9, handler=f"{COURSE_MATERIAL_FUNCTIONS_FOLDER}.delete_course_material.lambda_handler", code=_lambda.Code.from_asset(FUNCTIONS_FOLDER), role=LAMBDA_ROLE)
        
        # /course/quiz/
        get_course_quiz = _lambda.Function(self, "getCourseQuiz", runtime=_lambda.Runtime.PYTHON_3_9,
                                              handler="get_course_quiz.lambda_handler", code=_lambda.Code.from_asset(COURSE_QUIZ_FUNCTIONS_FOLDER), role=LAMBDA_ROLE)

        # /course/quiz/question Functions
        get_course_quiz_question = _lambda.Function(self, "getCourseQuizQuestion", runtime=_lambda.Runtime.PYTHON_3_9,
                                                     handler="get_course_quiz_question.lambda_handler", code=_lambda.Code.from_asset(COURSE_QUIZ_FUNCTIONS_FOLDER), role=LAMBDA_ROLE)
        post_course_quiz_question = _lambda.Function(self, "postCourseQuizQuestion", runtime=_lambda.Runtime.NODEJS_16_X,
                                                     handler="post_course_quiz_question.lambda_handler", code=_lambda.Code.from_asset(COURSE_QUIZ_FUNCTIONS_FOLDER), role=LAMBDA_ROLE)
        delete_course_quiz_question = _lambda.Function(self, "deleteCourseQuizQuestion", runtime=_lambda.Runtime.NODEJS_16_X,
                                                       handler="delete_course_quiz_question.lambda_handler", code=_lambda.Code.from_asset(COURSE_QUIZ_FUNCTIONS_FOLDER), role=LAMBDA_ROLE)

        # Create Amazon API Gateway REST API
        main_api = apigw.RestApi(self, "main", description="All LMS APIs")

        # Create resources for the API
        course_resource = main_api.root.add_resource("course")

        # Create sub-resources under the parent resource
        course_quizzes_resource = course_resource.add_resource("quiz")
        course_homework_resource = course_resource.add_resource("homework")
        course_announcement_resource = course_resource.add_resource(
            "announcement")
        course_material_resource = course_resource.add_resource("material")

        # Create sub-sub-resources under the parent resource
        course_quiz_questions_resource = course_quizzes_resource.add_resource(
            "question")

        # Create methods in the required resources

        # /course
        # Define a JSON Schema to accept Request Body in JSON format for POST Method
        post_course_model = main_api.add_model(
            # this is the response model ID, please give it a unique name and not ResponseModel
            "ResponseModel",
            content_type="application/json",
            model_name="PostCourseModel",
            schema=apigw.JsonSchema(
                title="PostCourseModel",
                schema=apigw.JsonSchemaVersion.DRAFT4,
                type=apigw.JsonSchemaType.OBJECT,
                properties={
                    "courseEndDate": apigw.JsonSchema(type=apigw.JsonSchemaType.STRING),
                    "courseName": apigw.JsonSchema(type=apigw.JsonSchemaType.STRING),
                    "courseTimeSlot": apigw.JsonSchema(type=apigw.JsonSchemaType.STRING)
                },
                required=["courseEndDate", "courseName", "courseTimeSlot"]))

        course_resource.add_method("GET", apigw.LambdaIntegration(get_course), request_parameters={
            'method.request.querystring.courseId': False})
        course_resource.add_method("DELETE", apigw.LambdaIntegration(delete_course), request_parameters={
            'method.request.querystring.courseId': True})
        course_resource.add_method("POST", apigw.LambdaIntegration(post_course), request_models={
            "application/json": post_course_model})

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
                    "materialLessonDate": apigw.JsonSchema(type=apigw.JsonSchemaType.STRING),
                    "materialLink": apigw.JsonSchema(type=apigw.JsonSchemaType.STRING),
                    "materialS3Link": apigw.JsonSchema(type=apigw.JsonSchemaType.STRING)
                },
                required=["courseId", "materialTitle", "materialType", "materialLessonDate"]))

        course_material_resource.add_method("GET", apigw.LambdaIntegration(get_course_material), request_parameters={
            'method.request.querystring.courseId': True,
            'method.request.querystring.materialId': False})
        course_material_resource.add_method("DELETE", apigw.LambdaIntegration(delete_course_material), request_parameters={
            'method.request.querystring.courseId': True,
            'method.request.querystring.materialId': True})
        course_material_resource.add_method("POST", apigw.LambdaIntegration(post_course_material), request_models={
            "application/json": post_course_material_model})

        # /course/quiz
        course_quizzes_resource.add_method(
            "GET", apigw.LambdaIntegration(get_course_quiz))

        # /course/quiz/question
        post_course_material_model = main_api.add_model(
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
                    "questionOptionType": apigw.JsonSchema(type=apigw.JsonSchemaType.STRING),
                    "Question": apigw.JsonSchema(type=apigw.JsonSchemaType.STRING),
                    "Options": apigw.JsonSchema(type=apigw.JsonSchemaType.ARRAY),
                    "Answer": apigw.JsonSchema(type=apigw.JsonSchemaType.STRING),
                },
                required=["courseId", "quizId", "materialType", "Question", "Options","Answer"]))
        
        course_quiz_questions_resource.add_method(
            "GET", apigw.LambdaIntegration(get_course_quiz_question))
        course_quiz_questions_resource.add_method(
            "POST", apigw.LambdaIntegration(post_course_quiz_question))
        course_quiz_questions_resource.add_method(
            "DELETE", apigw.LambdaIntegration(delete_course_quiz_question))
        
        # /course/homework
        course_homework_resource.add_method(
            "GET", apigw.LambdaIntegration(get_course_homework))

        # /course/announcement
        course_announcement_resource.add_method("GET", apigw.LambdaIntegration(get_course_announcement), request_parameters={
            'method.request.querystring.courseId': True,
            'method.request.querystring.announcementId': False})
        course_announcement_resource.add_method("DELETE", apigw.LambdaIntegration(delete_course_announcement), request_parameters={
            'method.request.querystring.courseId': True,
            'method.request.querystring.announcementId': False})
        course_announcement_resource.add_method("POST", apigw.LambdaIntegration(post_course_announcement), request_parameters={
            'method.request.querystring.courseEndDate': True,
            'method.request.querystring.announcementId': False})

        # Enable CORS for each resource/sub-resource etc.
        course_resource.add_cors_preflight(
            allow_origins=["*"], allow_methods=["GET", "POST", "DELETE"], status_code=200)
        course_quizzes_resource.add_cors_preflight(
            allow_origins=["*"], allow_methods=["GET", "PUT", "DELETE"], status_code=200)
        course_homework_resource.add_cors_preflight(
            allow_origins=["*"], allow_methods=["GET", "PUT", "DELETE"], status_code=200)
        course_quiz_questions_resource.add_cors_preflight(
            allow_origins=["*"], allow_methods=["GET", "PUT", "DELETE"], status_code=200)
        course_material_resource.add_cors_preflight(
            allow_origins=["*"], allow_methods=["GET", "PUT", "DELETE"], status_code=200)

        # Export API gateway to use in other Stacks
        CfnOutput(
            self, 'MyApiIdOutput',
            value=main_api.rest_api_id,
            export_name='mainApiId',
        )
        CfnOutput(
            self, 'MyApiRootResourceIdOutput',
            value=main_api.root.resource_id,
            export_name='mainApiRootResourceIdOutput',
        )
