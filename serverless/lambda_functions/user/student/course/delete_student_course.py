import sys
import boto3
import json

from global_functions.responses import *
from global_functions.exists_in_db import *
from global_functions.cognito import *


def lambda_handler(event, context):

    try:

        # VALIDATION
        # check if studentId exists in Cognito
        studentId = event['queryStringParameters']['studentId']
        if not get_user('Users', studentId):
            return response_404('studentId does not exist in Cognito')

        # check if <courseId> exists in database
        courseId = event['queryStringParameters']['courseId']
        if not id_exists("Course", "Course", courseId):
            return response_404("courseId does not exist in database.")

        # check if <studentId> has been registered with <courseId>
        if not combination_id_exists("Student", studentId, "Course", courseId):
            return response_404("This student has not been registered with the course")

        else:
            dynamodb = boto3.resource("dynamodb")
            table = dynamodb.Table("LMS")

            response = table.delete_item(
                Key={
                    "PK": f"Student#{studentId}",
                    "SK": f"Course#{courseId}"
                }
            )

            return response_200_msg("successfully deleted item")

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
