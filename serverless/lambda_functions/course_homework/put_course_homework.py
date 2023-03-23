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
        homework_due_date = request_body['homeworkDueDate']
        homework_id = request_body['homeworkId']
        homework_description = request_body['homeworkDescription']

        key = {
            "PK": f"Course#{course_id}",
            "SK": f"Homework#{homework_id}",
        }

        expression_attribute_values = {
            ":HomeworkTitle": homework_title,
            ":HomeworkDueDate": homework_due_date,
            ":HomeworkDescription": homework_description
        }

        table.updateItem(
            Key = key,
            UpdateExpression = 'SET HomeworkTitle = :HomeworkTitle, HomeworkDueDate = :HomeworkDueDate, HomeworkDescription = :HomeworkDescription',
            ExpressionAttributeValues=expression_attribute_values
        )

        return response_202_msg(f"Homework with id {homework_id} successfully updated")

    except Exception as e:
        return response_400(str(e))