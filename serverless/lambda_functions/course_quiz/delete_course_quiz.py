import boto3
import json

from global_functions.responses import *
from global_functions.exists_in_db import *


dynamodb = boto3.resource("dynamodb")
table = dynamodb.Table("LMS")


def lambda_handler(event, context):
    res = {}
    try:
        request_body = json.loads(event['body'])
        course_id = request_body['courseId']
        quiz_id = request_body['quizId']

        if not combination_id_exists("Course", course_id, "Quiz", quiz_id):
            return response_404("quizId does not exist in database")

        quizzes_response = table.query(
            KeyConditionExpression="PK= :PK AND begins_with(SK, :SK)",
            ExpressionAttributeValues={
                ":PK": f"Course#{course_id}",
                ":SK": f"Quiz#{quiz_id}"
            }
        )
        items = quizzes_response["Items"]

        for item in items:
            table.delete_item(
                Key={
                    'PK': item["PK"],
                    'SK': item["SK"]
                }
            )

        students_response = table.query(
            IndexName="SK-PK-index",
            KeyConditionExpression="SK = :SK AND begins_with(PK, :PK)",
            ExpressionAttributeValues={
                ":SK": f"Course#{course_id}",
                ":PK": "Student#"
            })

        students = students_response["Items"]
        for student in students:
            table.delete_item(
                Key={
                    'PK': f"Course#{course_id}",
                    'SK': f"{student['PK']}Quiz#{quiz_id}"
                }
            )

        return response_200_msg(f"successfully deleted quiz and all associated quiz questions under quizId : {quiz_id}")

    except Exception as e:
        return response_500(e)
