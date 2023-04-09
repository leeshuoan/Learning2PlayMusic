import boto3
import json
import uuid
from datetime import datetime, timezone

from global_functions.responses import *


dynamodb = boto3.resource('dynamodb')
table_name = "LMS"
table = dynamodb.Table(table_name)

def lambda_handler(event, context):

    random_uuid = str(uuid.uuid4())[:8]

    try:
        request_body = json.loads(event['body'])

        course_id = request_body['courseId']
        homework_title = request_body['homeworkTitle']
        homework_due_date = request_body['homeworkDueDate']
        homework_assigned_date = request_body['homeworkAssignedDate']
        homework_description = request_body['homeworkDescription']
        now = datetime.now(timezone.utc)
        homework_assigned_date = now.strftime('%Y-%m-%dT%H:%M:%S.%fZ')
        homework_id = random_uuid

        item = {
            "PK": f"Course#{course_id}",
            "SK": f"Homework#{homework_id}",
            "HomeworkTitle": homework_title,
            "HomeworkDueDate": homework_due_date,
            "HomeworkAssignedDate": homework_assigned_date,
            "HomeworkDescription": homework_description
        }

        table.put_item(Item=item)

        return response_202_msg(f"Homework successfully created with id {homework_id}")

    except Exception as e:
        return response_400(str(e))
