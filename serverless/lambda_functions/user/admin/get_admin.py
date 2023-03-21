import sys
import boto3
import json

from global_functions.responses import *
from global_functions.exists_in_db import *
from global_functions.cognito import *

def lambda_handler(event, context):

    try:

        # get all students from Cognito
        students = get_users('Users')

        # check if <studentId> is being passed in
        studentId = event['queryStringParameters']
        if studentId is None or studentId == "null":
            return response_200_items(students)

        else:
            studentId = event['queryStringParameters']['studentId']
            for student in students:
                if studentId == student['studentId']:
                    return response_200_items(student)



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
