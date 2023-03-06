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
        course_id = request_body['courseId']
        student_id = request_body['studentId']
        homework_id = request_body['homeworkId']
        base64data = request_body['homeworkContent']

        # Extract the file extension and decode the base64 data
        file_extension = base64data.split(';')[0].split('/')[1]
        base64_value = base64data.split(',')[1]
        homework_content = base64.b64decode(base64_value)

        random_uuid = str(uuid.uuid4().int)[:8]
        # Upload the image data to S3
        key = f'Course{course_id}/Student{student_id}/Homework{homework_id}_{random_uuid}.{file_extension}'
        if file_extension == "pdf":
            content_type = "application/pdf"
        elif file_extension == "png" or file_extension == "jpg" or file_extension == "jpeg":
            content_type = f'image/{file_extension}'
        else:
            raise ("Submission must a .pdf, .png, .jpg or .jpeg file")

        s3_params = {
            'Bucket': bucket_name,
            'Key': key,
            'Body': homework_content,
            'ContentType': content_type,
            'ContentDisposition': "inline"
        }

        s3.put_object(**s3_params)

        item = {
            'PK': f'Course#{course_id}',
            'SK': f'Student#{student_id}Homework#{homework_id}',
            'HomeworkContent': bucket_name + "/" + key
        }

        response = table.put_item(Item=item)

        return response_202_msg(f"{file_extension} file successfully uploaded")

    except Exception as e:
        return response_400(str(e))
