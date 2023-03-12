import sys
import boto3
import json

from global_functions.responses import *
from global_functions.exists_in_db import *


def lambda_handler(event, context):

    try:
        queryStringParameters: dict = event["queryStringParameters"]
        dynamodb = boto3.resource("dynamodb")
        table = dynamodb.Table("LMS")

        course_id = queryStringParameters['courseId']

        # check if <quizId> exists in database
        quiz_id = queryStringParameters['quizId']
        if not combination_id_exists("Course", course_id, "Quiz", quiz_id):
            return response_404("quizId does not exist in database")
        
        response = table.query(
            KeyConditionExpression="PK= :PK AND begins_with(SK, :SK)",
            ExpressionAttributeValues={
                ":PK": f"Course#{course_id}",
                ":SK": f"Quiz#"
            }
        )
        items = response["Items"]

        for item in items:
            table.delete_item(
                TableName='your-table-name',
                Key={
                    'PK': {'S': item['PK']},
                    'SK': {'S': item['SK']}
                }
            )

        return response_200_msg(f"successfully deleted quiz and all associated quiz questions under quizId : {quiz_id}")

    except Exception as e:
        return response_500(e)
