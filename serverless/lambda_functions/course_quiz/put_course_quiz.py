import boto3

from global_functions.responses import *


def lambda_handler(event, context):

    dynamodb = boto3.resource('dynamodb')
    table_name = "LMS"
    table = dynamodb.Table(table_name)

    try:
        request_body = json.loads(event['body'])

        course_id = request_body['courseId']
        quiz_id = request_body['quizId']
        quiz_title = request_body['quizTitle']
        quiz_max_attempts = request_body['quizMaxAttempts']
        quiz_description = request_body['quizDescription']
        visibility = request_body['visibility']

        if quiz_title == "":
            return response_400("quiz title cannot be left blank")

        quiz_key = {
            "PK": f"Course#{course_id}",
            "SK": f"Quiz#{quiz_id}",
        }
        quiz_update_expression = 'SET QuizTitle = :quizTitle, QuizMaxAttempts = :quizMaxAttempts, QuizDescription = :quizDescription, Visibility= :visibility'
        quiz_expression_attribute_values = {
            ':quizTitle': quiz_title,
            ':quizMaxAttempts': quiz_max_attempts,
            ':quizDescription': quiz_description,
            ':visibility': visibility,
        }
        table.update_item(
            Key=quiz_key,
            UpdateExpression=quiz_update_expression,
            ExpressionAttributeValues=quiz_expression_attribute_values
        )

        students_response = table.query(
            IndexName="SK-PK-index",
            KeyConditionExpression="SK = :SK AND begins_with(PK, :PK)",
            ExpressionAttributeValues={
                ":SK": f"Course#{course_id}",
                ":PK": "Student#"
            })

        students = students_response["Items"]
        students_update_expression = 'SET QuizTitle = :quizTitle, QuizMaxAttempts = :quizMaxAttempts, Visibility= :visibility, QuizAttempt = :default, QuizScore= :default'
        students_expression_attribute_values = {
            ':quizTitle': quiz_title,
            ':quizMaxAttempts': quiz_max_attempts,
            ':visibility': visibility,
            ':default': 0
        }
        for student in students:
            table.update_item(
                Key={
                    'PK': f"Course#{course_id}",
                    'SK': f"{student['PK']}Quiz#{quiz_id}",
                },
                UpdateExpression=students_update_expression,
                ExpressionAttributeValues=students_expression_attribute_values
            )

        return response_202_msg(f"Quiz with id {quiz_id} successfully updated ")

    except Exception as e:
        return response_400(str(e))
