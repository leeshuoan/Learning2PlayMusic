import sys
import boto3
import json

from global_functions.responses import *
from global_functions.exists_in_db import *

# Delete a course announcement under a course
def lambda_handler(event, context):

    res = {}
    try:
        # VALIDATION
        # check if <courseId> exists in database
        courseId = event['queryStringParameters']['courseId']
        if not course_id_exists(courseId):
            return response_400("courseId does not exist in database")

        # check if <announcementId> exists in database
        announcementId = event['queryStringParameters']['announcementId']
        if not course_item_id_exists(courseId, "Announcement", announcementId):
            return response_400("materialId does not exist in database")
    
        courseId = event["queryStringParameters"]["courseId"]
        announcementId = event["queryStringParameters"]["announcementId"]

        dynamodb = boto3.resource("dynamodb")
        table = dynamodb.Table("LMS")

        table.delete_item(
            Key={
                "PK": f"Course#{courseId}",
                "SK": f"Announcement#{announcementId}"
            })

        return response_200("successfully deleted item")


    except Exception as e:
        exception_type, exception_object, exception_traceback = sys.exc_info()
        filename = exception_traceback.tb_frame.f_code.co_filename
        line_number = exception_traceback.tb_lineno
        print("❗Exception type: ", exception_type)
        print("❗File name: ", filename)
        print("❗Line number: ", line_number)
        print("❗Error: ", e)
        return {
            "statusCode": 500,
            "body": str(e)
        }
