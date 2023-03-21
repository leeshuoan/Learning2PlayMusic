import sys
import boto3
import json

from global_functions.responses import *
from global_functions.exists_in_db import *
from global_functions.cognito import *

def lambda_handler(event, context):

    try:

        # get all teachers from Cognito
        teachers = get_users('Teachers')

        # check if <teacherId> is being passed in
        teacherId = event['queryStringParameters']
        if teacherId is None or teacherId == "null":
            return response_200_items(teachers)

        else:
            teacherId = event['queryStringParameters']['teacherId']
            for teacher in teachers:
                if teacherId == teacher['teacherId']:
                    return response_200_items(teacher)


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
