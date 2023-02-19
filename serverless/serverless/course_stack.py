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
        COURSE_HOMEWORK_FUNCTIONS_FOLDER = FUNCTIONS_FOLDER+"course_homework/"
        COURSE_QUIZ_FUNCTIONS_FOLDER = FUNCTIONS_FOLDER+"course_quiz/"
        COURSE_ANNOUNCEMENT_FUNCTIONS_FOLDER = FUNCTIONS_FOLDER + "course_announcement/"

        # Get existing iam role (lambda-general-role)
        iam = boto3.client("iam")
        role = iam.get_role(RoleName="lambda-general-role")
        role_arn = role["Role"]["Arn"]
        LAMBDA_ROLE = aws_iam.Role.from_role_arn(
            self, "lambda-general-role", role_arn)

        # Create getCourseQuizzes AWS Lambda function
        get_course_quizzes = _lambda.Function(
            self,
            "getCourseQuizzes",  # name of your lambda function
            runtime=_lambda.Runtime.PYTHON_3_9,
            # change based on your python file name
            handler="get_course_quizzes.lambda_handler",
            code=_lambda.Code.from_asset(COURSE_QUIZ_FUNCTIONS_FOLDER),
            role=LAMBDA_ROLE
        )

        # Create getCourseQuizQuestions AWS Lambda function
        get_course_quiz_questions = _lambda.Function(
            self,
            "getCourseQuizQuestions",  # name of your lambda function
            runtime=_lambda.Runtime.PYTHON_3_9,
            # change based on your python file name
            handler="get_course_quiz_questions.lambda_handler",
            code=_lambda.Code.from_asset(COURSE_QUIZ_FUNCTIONS_FOLDER),
            role=LAMBDA_ROLE
        )

        # Create putCourseQuizQuestion AWS Lambda function
        put_course_quiz_question = _lambda.Function(
            self,
            "putCourseQuizQuestion",  # name of your lambda function
            runtime=_lambda.Runtime.NODEJS_16_X,
            # change based on your python file name
            handler="put_course_quiz_question.lambda_handler",
            code=_lambda.Code.from_asset(COURSE_QUIZ_FUNCTIONS_FOLDER),
            role=LAMBDA_ROLE
        )

        # Create getCourseHomework AWS Lambda function
        get_course_homework = _lambda.Function(
            self,
            "getCourseHomework",  # name of your lambda function
            runtime=_lambda.Runtime.PYTHON_3_9,
            # change based on your python file name
            handler="get_course_homework.lambda_handler",
            code=_lambda.Code.from_asset(COURSE_HOMEWORK_FUNCTIONS_FOLDER),
            role=LAMBDA_ROLE
        )

        # Create getCourseAnnouncements AWS Lambda function
        get_course_announcements = _lambda.Function(
            self,
            "getCourseAnnouncements",  # name of your lambda function
            runtime=_lambda.Runtime.PYTHON_3_9,
            # change based on your python file name
            handler="get_course_announcements.lambda_handler",
            code=_lambda.Code.from_asset(COURSE_ANNOUNCEMENT_FUNCTIONS_FOLDER),
            role=LAMBDA_ROLE
        )
        post_course_announcements = _lambda.Function(
            self,
            "postCourseAnnouncements",
            runtime=_lambda.Runtime.PYTHON_3_9,
            handler="post_course_announcements.lambda_handler",
            code=_lambda.Code.from_asset(COURSE_FUNCTIONS_FOLDER),
            role=LAMBDA_ROLE)
        delete_course_announcements = _lambda.Function(
            self,
            "deleteCourseAnnouncements",
            runtime=_lambda.Runtime.PYTHON_3_9,
            handler="delete_course_announcements.lambda_handler",
            code=_lambda.Code.from_asset(COURSE_FUNCTIONS_FOLDER),
            role=LAMBDA_ROLE)

        # Create AWS Lambda functionS
        # /course
        get_course = _lambda.Function(self, "getCourse", runtime=_lambda.Runtime.PYTHON_3_9,
                                      handler="get_course.lambda_handler", code=_lambda.Code.from_asset(COURSE_FUNCTIONS_FOLDER), role=LAMBDA_ROLE)
        post_course = _lambda.Function(self, "postCourse", runtime=_lambda.Runtime.PYTHON_3_9,
                                       handler="post_course.lambda_handler", code=_lambda.Code.from_asset(COURSE_FUNCTIONS_FOLDER), role=LAMBDA_ROLE)
        delete_course = _lambda.Function(self, "deleteCourse", runtime=_lambda.Runtime.PYTHON_3_9,
                                         handler="delete_course.lambda_handler", code=_lambda.Code.from_asset(COURSE_FUNCTIONS_FOLDER), role=LAMBDA_ROLE)

        # Create Amazon API Gateway REST API
        main_api = apigw.RestApi(
            self,
            "main",
            description="All LMS APIs")

        # Create resources for the API
        course_resource = main_api.root.add_resource("course")
        course_resource = main_api.root.add_resource(
            "course", default_cors_preflight_options=False)

        # Create sub-resources under the parent resource
        course_quizzes_resource = course_resource.add_resource("quiz")
        course_homework_resource = course_resource.add_resource("homework")
        course_announcements_resource = course_resource.add_resource(
            "announcements")

        # Create sub-sub-resources under the parent resource
        course_quiz_questions_resource = course_quizzes_resource.add_resource(
            "question")

        # Create methods in the required resources
        # /course
        course_resource.add_method("GET", apigw.LambdaIntegration(
            get_course), request_parameters={'method.request.querystring.courseId': False})
        course_resource.add_method("DELETE", apigw.LambdaIntegration(
            delete_course), request_parameters={'method.request.querystring.courseId': True})
        course_resource.add_method("POST", apigw.LambdaIntegration(post_course), request_parameters={
            'method.request.querystring.courseEndDate': True,
            'method.request.querystring.courseName': True,
            'method.request.querystring.courseTimeSlot': True,
        })

        # /course/quiz
        course_quizzes_resource.add_method(
            "GET", apigw.LambdaIntegration(get_course_quizzes))

        # /course/quiz/question
        course_quiz_questions_resource.add_method(
            "GET", apigw.LambdaIntegration(get_course_quiz_questions))
        course_quiz_questions_resource.add_method(
            "POST", apigw.LambdaIntegration(put_course_quiz_question))

        # /course/homework
        course_homework_resource.add_method(
            "GET", apigw.LambdaIntegration(get_course_homework))

        # /course/announcement
        course_announcements_resource.add_method("GET", apigw.LambdaIntegration(get_course_announcements), request_parameters={
            'method.request.querystring.courseId': True,
            'method.request.querystring.announcementId': False})
        course_announcements_resource.add_method("DELETE", apigw.LambdaIntegration(delete_course_announcements), request_parameters={
            'method.request.querystring.courseId': True,
            'method.request.querystring.announcementId': False})
        course_announcements_resource.add_method("POST", apigw.LambdaIntegration(post_course_announcements), request_parameters={
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

        # Export API gateway to use in other Stacks
        CfnOutput(
            self, 'MyApiIdOutput',
            value=main_api.rest_api_id,
            export_name='mainApiId',
        )
