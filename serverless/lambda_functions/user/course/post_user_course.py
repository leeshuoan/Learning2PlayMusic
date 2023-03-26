import sys
import boto3
import json
import uuid

from global_functions.responses import *
from global_functions.exists_in_db import *
from global_functions.cognito import *

def lambda_handler(event, context):

    try:

        userId = event['queryStringParameters']['userId']

        # check if user exists in Cognito
        user = get_user(userId)
        if not user:
            return response_404('userId does not exist in Cognito')

        # check if <courseId> exists in database
        courseId = event['queryStringParameters']['courseId']
        if not id_exists("Course", "Course", courseId):
            return response_404("courseId does not exist in database.")

        if 'studentId' in user:
            userType = 'Student'

        elif 'teacherId' in user:
            userType = 'Teacher'

        else:
            return response_400("Please check that you have entered a correct studentId/teacherId")

        # check if <userId><courseId> combination exists in database
        if combination_id_exists(userType, userId, "Course", courseId):
            return response_202_msg(f"This {userType.lower()} has been enrolled with the course")

        # enroll user to course
        dynamodb = boto3.resource("dynamodb")
        table = dynamodb.Table("LMS")

        item = {
                "PK": f"{userType}#{userId}",
                "SK": f"Course#{courseId}"
            }

        table.put_item(Item=item)

        return response_200_msg_items("inserted", item)

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
