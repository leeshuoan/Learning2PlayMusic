import base64
import boto3
import json
import uuid
import os

dynamodb = boto3.resource('dynamodb')
table_name = "LMS"
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

        # Upload the image data to S3
        key = f'Course{course_id}/Student{student_id}/Homework{homework_id}.{file_extension}'
        if file_extension == "pdf":
            content_type = "application/pdf"
        else:
            content_type = f'image/{file_extension}'       

        s3_params = {
            'Bucket': bucket_name,
            'Key': key,
            'Body': homework_content,
            'ContentType': content_type,
            'ContentDisposition:': "inline"
        }

        uploaded_image = s3.put_object(**s3_params)

        return {
            "statusCode": 200,
            "body": json.dumps({"message": f"{file_extension} file successfully uploaded"})
        }
        dynamo_key = {
            "PK": f"Course#{course_id}",
            "SK": f"Student#{student_id}Quiz#{homework_id}"
        }


        update_params = {
            "TableName": table_name,
            "Key": key,
        }

        after_update_response = dynamodb.put_item(update_params)



    except Exception as e:
        return {
            "statusCode": 400,
            "body": json.dumps({"error": str(e)})
        }