import sys
import boto3
import json

from global_functions.responses import *
from global_functions.exists_in_db import *
from global_functions.cognito import *

def lambda_handler(event, context):

    try:

        studentId = event['queryStringParameters']['studentId']

        # get all teachers from Cognito
        teachers = get_users('Teachers')

        # check for teachers who teach this student
        

        all_users = []

        [all_users.append(admin) for admin in admins if admin['adminId']!=adminId]
        [all_users.append(student) for student in students]
        [all_users.append(teacher) for teacher in teachers]

        return response_200_items(all_users)

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
