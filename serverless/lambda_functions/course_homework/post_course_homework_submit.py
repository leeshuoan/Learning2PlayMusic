import base64
import boto3
import json
import uuid
import os

from global_functions.responses import *

dynamodb = boto3.resource('dynamodb')
table_name = "LMS"
table = dynamodb.Table(table_name)
bucket_name = os.environ['HOMEWORK_SUBMISSION_BUCKET_NAME']
s3 = boto3.client('s3')


def lambda_handler(event, context):
    try:
        request_body = json.loads(event['body'])
        if 'homeworkContent' not in request_body and 'homeworkAttachment' not in request_body:
            raise ("Both content and attachment cannot be empty!")

        course_id = request_body['courseId']
        student_id = request_body['studentId']
        homework_id = request_body['homeworkId']
        increment = handle_content(
            request_body, course_id, student_id, homework_id, table)
        handle_attachment(
            request_body, course_id, student_id, homework_id, table, increment)

        return response_202_msg(f"homework successfully submitted")

    except Exception as e:
        return response_400(str(e))


def handle_content(request_body, course_id, student_id, homework_id, table):

    if 'homeworkContent' in request_body:
        key = {
            'PK': f'Course#{course_id}',
            'SK': f'Student#{student_id}Homework#{homework_id}',
        }

        table.update_item(
            Key=key,
            UpdateExpression=f"SET NumAttempts = if_not_exists(NumAttempts, :start) + :increment, Marked = if_not_exists(Marked, :marked), HomeworkContent = :homeworkContent, HomeworkScore = if_not_exists(HomeworkScore, :start)",
            ExpressionAttributeValues={
                ':start': 0,
                ':increment': 1,
                ':marked': False,
                ':homeworkContent': request_body['homeworkContent']
            }
        )

        return 0
    return 1

def handle_attachment(request_body, course_id, student_id, homework_id, table, increment):

    if 'homeworkAttachment' in request_body:
        base64data = request_body['homeworkAttachment']

        # Extract the file extension and decode the base64 data
        file_extension = base64data.split(';')[0].split('/')[1]
        base64_value = base64data.split(',')[1]
        homework_attachment = base64.b64decode(base64_value)

        random_uuid = str(uuid.uuid4().int)[:8]
        # Upload the image data to S3
        key = f'Course{course_id}/Student{student_id}/Homework{homework_id}_{random_uuid}.{file_extension}'
        if file_extension == "pdf":
            content_type = "application/pdf"
        elif file_extension == "png" or file_extension == "jpg" or file_extension == "jpeg":
            content_type = f'image/{file_extension}'
        else:
            raise ("Attachment must a .pdf, .png, .jpg or .jpeg file")

        s3_params = {
            'Bucket': bucket_name,
            'Key': key,
            'Body': homework_attachment,
            'ContentType': content_type,
            'ContentDisposition': "inline"
        }
        s3.put_object(**s3_params)

        # DYNAMODB STUFF
        item = {
            'FileName': f'Homework{homework_id}_{random_uuid}.{file_extension}',
            'HomeworkAttachment': bucket_name + "/" + key
        }

        key = {
            'PK': f'Course#{course_id}',
            'SK': f'Student#{student_id}Homework#{homework_id}',
        }
        response = table.get_item(Key=key)

        if 'Item' in response:
            # The item already exists, update it
            table.update_item(
                Key=key,
                UpdateExpression='set SubmissionFileName = if_not_exists(SubmissionFileName, :filename), HomeworkAttachment=if_not_exists(SubmissionFileName, :attachment), NumAttempts = if_not_exists(NumAttempts, :start) + :increment',
                ExpressionAttributeValues={
                    ':filename': item['FileName'],
                    ':attachment': item['HomeworkAttachment'],
                    ':increment': increment,
                    ':start': 0,
                }
            ),

        else:
            # The item does not exist, put it
            table.put_item(
                Item={
                    'PK': f'Course#{course_id}',
                    'SK': f'Student#{student_id}Homework#{homework_id}',
                    'NumAttempts': 0,
                    'Marked': False,
                    'SubmissionFileName': item['FileName'],
                    'HomeworkAttachment': item['HomeworkAttachment'],
                    'HomeworkScore': 0
                }
            )
