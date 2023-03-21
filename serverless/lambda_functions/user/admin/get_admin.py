import sys
import boto3
import json

from global_functions.responses import *
from global_functions.exists_in_db import *
from global_functions.cognito import *

### THIS FUNCTION IS BUILT FOR GENERAL ADMINS ONLY ###

def lambda_handler(event, context):

    try:

        # get all admins from Cognito
        admins = get_users('Admins')

        # check if <adminId> is being passed in
        adminId = event['queryStringParameters']
        if adminId is None or adminId == "null":
            return response_200_items(admins)

        else:
            adminId = event['queryStringParameters']['adminId']
            for admin in admins:
                if adminId == admin['adminId']:
                    return response_200_items(admin)



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
