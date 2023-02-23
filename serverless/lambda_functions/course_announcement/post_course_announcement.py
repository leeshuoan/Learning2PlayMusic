import sys
import boto3
import json
import uuid

from global_functions.responses import *
from global_functions.exists_in_db import *

# Add a new course announcement under a course
def lambda_handler(event, context):
    
    announcementId = str(uuid.uuid4().hex)[:8]

    res = {}
    try:

        # VALIDATION
        # checks that courseId passed in is not an empty string
        if json.loads(event['body'])['courseId']=="":
            return response_400("courseId is missing")

        # check if <courseId> already exists in database
        courseId = json.loads(event['body'])['courseId']
        if not course_id_exists(courseId):
            return response_400("courseId does not exist in database")
        dynamodb = boto3.resource("dynamodb")
        table = dynamodb.Table("LMS")

        table.put_item(
            Item={
                "PK": f"Course#{json.loads(event['body'])['courseId']}",
                "SK": f"Announcement#{announcementId}",
                "Content": json.loads(event['body'])['content'],
                "Date": json.loads(event['body'])['date']
            })

        return response_200("successfully inserted item")


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
