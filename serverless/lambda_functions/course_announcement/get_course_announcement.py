import sys
import boto3
import json

from global_functions.responses import *

# Get all course announcements under a course
def lambda_handler(event, context):
  
    courseId = event["queryStringParameters"]["courseId"]
    if courseId is None or courseId == "null":
            sortkey = "Announcement#"
    else:
        announcementId = event["queryStringParameters"]["announcementId"]        
        sortkey = "Announcement#" + announcementId
    res = {}
    try:
        dynamodb = boto3.resource("dynamodb")
        table = dynamodb.Table("LMS")

        response = table.query(
            KeyConditionExpression="PK = :PK AND begins_with(SK, :SK)",
            ExpressionAttributeValues={
                ":PK": f"Course#{courseId}",
                ":SK": sortkey
            })

        items = response["Items"]

        return response_200_GET(items)


    except Exception as e:
    # print(f".......... 🚫 UNSUCCESSFUL: Failed request for Course ID: {courseId} 🚫 ..........")
        exception_type, exception_object, exception_traceback = sys.exc_info()
        filename = exception_traceback.tb_frame.f_code.co_filename
        line_number = exception_traceback.tb_lineno
        print("❗Exception type: ", exception_type)
        print("❗File name: ", filename)
        print("❗Line number: ", line_number)
        print("❗Error: ", e)
        return {
            "statusCode": 500,
            "body": str(e),
            
        }