import sys
import boto3
import json

from global_functions.responses import *
from global_functions.exists_in_db import *

def lambda_handler(event, context):

    try:

        # check if <teacherId> is being passed in
        teacherId = event['queryStringParameters']
        if teacherId is None or teacherId == "null":
            sortKey = "Teacher#"
        else:
            teacherId = event['queryStringParameters']['teacherId']
            sortKey = "Teacher#" + teacherId

            # check if <teacherId> exists in database
            if not id_exists("User", "Teacher", teacherId):
                return response_404("teacherId does not exist in database")

        dynamodb = boto3.resource("dynamodb")
        table = dynamodb.Table("LMS")
        
        response = table.query(
            KeyConditionExpression="PK = :PK AND begins_with(SK, :SK)",
            ExpressionAttributeValues={
                ":PK": "User",
                ":SK": sortKey
            }
            )

        items = response["Items"]

        return response_200_items(items)


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
