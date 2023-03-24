import sys
import boto3
import json

from global_functions.responses import *
from global_functions.exists_in_db import *
from global_functions.cognito import *

### THIS FUNCTION IS BUILT FOR GENERAL ADMINS ONLY ###

def lambda_handler(event, context):

    try:

        adminId = event['queryStringParameters']['adminId']

        # check if adminId exists in Cognito
        if not get_user(adminId):
            return response_404('adminId does not exist in Cognito')
        
        dynamodb = boto3.resource("dynamodb")
        table = dynamodb.Table("Chat")

        response = table.query(
            IndexName="SK-PK-index",
            KeyConditionExpression="SK = :SK",
            ExpressionAttributeValues={
                ":SK": f"Admin#{adminId}"
            })

        items = response["Items"]



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