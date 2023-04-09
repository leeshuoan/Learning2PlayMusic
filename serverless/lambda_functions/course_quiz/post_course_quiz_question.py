import json
import os
import boto3
from uuid import uuid4
from base64 import b64decode

from global_functions.responses import *

dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table("LMS")
s3 = boto3.client('s3')

bucket_name = os.environ['QUESTION_IMAGE_BUCKET_NAME']


def lambda_handler(event, context):
    try:
        question_count = 0
        request_body = json.loads(event['body'])     
        course_id = ""
        quiz_id = ""

        for question in request_body:
            random_uuid = str(uuid4())[:8]
            
            question_count += 1
            course_id = question['courseId']
            quiz_id = question['quizId']
            question_option_type = question['questionOptionType']
            question_text = question['question']
            options = question['options']
            answer = question['answer']
            question_id = random_uuid

            options_stats = {}
            for option in options:
                options_stats[option] = 0

            question_item = {
                'PK': f'Course#{course_id}',
                'SK': f'Quiz#{quiz_id}Question#{question_id}',
                'QuestionOptionType': question_option_type,
                'Question': question_text,
                'Options': options,
                'Answer': answer,
                'Attempts': 0,
                'Correct': 0,
                **options_stats
            }

            if answer not in options:
                raise ValueError(
                    "answer must be one of the options for question " + question_text)

            uploaded_image = None
            s3_params = {}
            if 'questionImage' in question and question['questionImage'] != "":
                base64_data = question['questionImage']
                file_extension = base64_data.split(";")[0].split("/")[1]
                base64_value = base64_data.split(',')[1]
                image_buffer = b64decode(base64_value)
                s3_params = {
                    'Bucket': bucket_name,
                    'Key': f'Course{course_id}/Quiz{quiz_id}/Question{question_id}.{file_extension}',
                    'Body': image_buffer,
                    'ContentType': 'image/' + file_extension
                }

                uploaded_image = s3.put_object(**s3_params)
                question_item['QuestionImage'] = s3_params['Bucket'] + \
                    "/" + s3_params['Key']

            table.put_item(
                Item=question_item
            )

        table.update_item(
            Key={
                'PK': f'Course#{course_id}',
                'SK': f'Quiz#{quiz_id}'
            },
            UpdateExpression="SET QuestionCount = QuestionCount + :val",
            ExpressionAttributeValues={
                ':val': question_count
            }
        )

        return response_202_msg(f'Successfully inserted {question_count} Question(s)!')

    except Exception as e:
        return response_400(str(e))