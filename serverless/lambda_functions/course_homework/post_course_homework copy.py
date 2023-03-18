import boto3
import json
import uuid

from global_functions.responses import *

def lambda_handler(event, context):

    dynamodb = boto3.resource('dynamodb')
    table_name = "LMS"
    table = dynamodb.Table(table_name)

    try:
        request_body = json.loads(event['body'])

        course_id = request_body['courseId']
        homework_title = request_body['homeworkTitle']
        homework_id = request_body['homeworkId']
        homework_due_date = request_body['homeworkDueDate']

        item = {
            "PK": f"Course#{course_id}",
            "SK": f"Homework#{homework_id}",
            "HomeworkTitle": homework_title,
            "HomeworkDueDate": homework_due_date
        }

        table.put_item(Item = item)

        return response_202_msg(f"Homework successfully created with id {homework_id}")

    except Exception as e:
        return response_400(str(e))