import sys
import boto3
import json
import uuid
from datetime import datetime
import dateutil.tz


from global_functions.responses import *
from global_functions.exists_in_db import *

def lambda_handler(event, context):

    try:
        dynamodb = boto3.resource("dynamodb")
        table = dynamodb.Table("LMS")

        sgTimezone = dateutil.tz.gettz('Asia/Singapore')
        date = datetime.now(tz=sgTimezone).strftime("%Y-%m-%dT%H:%M:%S")

        # VALIDATION
        # checks that courseId passed in is not an empty string
        if json.loads(event['body'])['courseId']=="":
            return response_400("courseId is missing")
        
        # checks that announcementId passed in is not an empty string
        if json.loads(event['body'])['announcementId']=="":
            return response_400("announcementId is missing")
        
        # check if <courseId> exists in database
        courseId = json.loads(event['body'])['courseId']
        if not id_exists("Course", "Course", courseId):
            return response_404("courseId does not exist in database")

        # check if <announcementId> exists in database
        announcementId = json.loads(event['body'])['courseId']
        if not combination_id_exists("Course", courseId, "Announcement", announcementId):
            return response_404("announcementId does not exist in database")


        item = {
                "PK": f"Course#{courseId}",
                "SK": f"Announcement#{announcementId}",
                "Title": json.loads(event['body'])['title'],
                "Content": json.loads(event['body'])['content'],
                "Date": str(date)
            }
        response = table.update_item(
            Key={"PK": f"Course#{json.loads(event['body'])['courseId']}",
                "SK": f"Announcement#{announcementId}"},
            UpdateExpression="set Title = :t, Content = :c, Date = :d",
            ExpressionAttributeValues={":t": json.loads(event['body'])['title'],
                                       ":c": json.loads(event['body'])['content'],
                                       ":d": str(date)},
            ReturnValues="UPDATED_NEW")

        return response_200_msg_items("updated", item)

    # currently, this is only for functions that sends in request body - to catch 'missing fields' error
    except KeyError:
        print("❗Exception Type Caught - KeyError")
        return response_500("One or more field(s) is missing. Please double check that all fields in the model schema are populated.")

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