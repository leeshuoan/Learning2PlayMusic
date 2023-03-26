import sys
import boto3
import json
import os

from global_functions.responses import *
from global_functions.exists_in_db import *


s3 = boto3.client('s3')


def lambda_handler(event, context):

    try:
        dynamodb = boto3.resource("dynamodb")
        table = dynamodb.Table("LMS")
        request_body: dict = json.loads(event['body'])

        course_id = request_body['courseId']
        homework_id = request_body['homeworkId']

        table.delete_item(
            Key={
                "PK": f"Course#{course_id}",
                "SK": f"Homework#{homework_id}"
            })

        return response_200_msg(f"successfully deleted item homework: {course_id} and {homework_id} ")

    except Exception as e:
        # print(f".......... 🚫 UNSUCCESSFUL: Failed request for Course ID: {courseId} 🚫 ..........")
        exception_type, exception_object, exception_traceback = sys.exc_info()
        filename = exception_traceback.tb_frame.f_code.co_filename
        line_number = exception_traceback.tb_lineno
        print("❗Exception type: ", exception_type)
        print("❗File name: ", filename)
        print("❗Line number: ", line_number)
        print("❗Error: ", e)

        return response_500(e)
