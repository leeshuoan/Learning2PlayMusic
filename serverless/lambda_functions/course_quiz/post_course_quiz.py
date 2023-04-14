import boto3
import json
import uuid

from global_functions.responses import *

dynamodb = boto3.resource('dynamodb')
table_name = "LMS"
table = dynamodb.Table(table_name)

def lambda_handler(event, context):


    random_uuid = str(uuid.uuid4())[:8]

    try:
        request_body = json.loads(event['body'])

        course_id = request_body['courseId']
        quiz_title = request_body['quizTitle']
        quiz_max_attempts = request_body['quizMaxAttempts']
        quiz_description = request_body['quizDescription']
        visibility = request_body['visibility']
        quiz_id = random_uuid

        item = {
            "PK": f"Course#{course_id}",
            "SK": f"Quiz#{quiz_id}",
            "QuizTitle": quiz_title,
            "QuizMaxAttempts": quiz_max_attempts,
            "QuizDescription": quiz_description,
            "NumberOfAttempts": 0,
            "TotalScore": 0,
            "Visibility": visibility,
            "QuestionCount": 0

        }

        table.put_item(Item=item)

        students_response = table.query(
            IndexName="SK-PK-index",
            KeyConditionExpression="SK = :SK AND begins_with(PK, :PK)",
            ExpressionAttributeValues={
                ":SK": f"Course#{course_id}",
                ":PK": "Student#"
            })

        students = students_response["Items"]
        for student in students:
            table.put_item(
                Item={
                    'PK': f"Course#{course_id}",
                    'SK': f"{student['PK']}Quiz#{quiz_id}",
                    "QuizTitle": quiz_title,
                    "QuizMaxAttempts": quiz_max_attempts,
                    "Visibility": visibility,
                    "QuizAttempt": 0,
                    "QuizScore": 0,
                }
            )

        return response_202_msg(f"Quiz successfully created with id {quiz_id}")

    except Exception as e:
        return response_400(str(e))
