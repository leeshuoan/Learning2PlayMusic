import sys
import boto3
import json
import uuid

from global_functions.responses import *
from global_functions.exists_in_db import *
from global_functions.cognito import *

### THIS FUNCTION IS BUILT FOR GENERAL ADMINS ONLY ###

def lambda_handler(event, context):

    try:

        adminId = event['queryStringParameters']['adminId']
        userId = event['queryStringParameters']['userId']

        # check if adminId exists in Cognito
        if not get_user(adminId):
            return response_404('adminId does not exist in Cognito')
        
        # check if userId exists in Cognito
        if not get_user(userId): # either teacher or student
            return response_404('userId does not exist in Cognito')
        
        # get user
        user = get_user(userId)

        if 'teacher' in user.keys():
            primarykey = f"Teacher#{userId}"

        if 'student' in user.keys():
            primarykey = f"Student#{userId}"

        dynamodb = boto3.resource("dynamodb")
        table = dynamodb.Table("Chat")
        short_uuid = str(uuid.uuid4().hex)[:8]

        item = {
                "PK": primarykey,
                "SK": f"Admin#{adminId}",
                "ChatId": short_uuid
            }
        response = table.put_item(Item=item)

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
