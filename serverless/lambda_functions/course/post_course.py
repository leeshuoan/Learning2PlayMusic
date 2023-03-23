import sys
import boto3
import json
import uuid

from global_functions.responses import *
from global_functions.exists_in_db import *
from global_functions.cognito import *

def lambda_handler(event, context):

    try:

        # VALIDATION
        # checks that teacherId passed in is not an empty string
        if json.loads(event['body'])['teacherId']=="":
            return response_400("teacherId is missing")

        # check if <teacherId> exists in database
        teacherId = json.loads(event['body'])['teacherId']

        if not get_user('Teachers', teacherId):
            return response_404("teacherId does not exist in Cognito")

        dynamodb = boto3.resource("dynamodb")
        table = dynamodb.Table("LMS")
        short_uuid = str(uuid.uuid4().hex)[:8]

        item = {
            "PK": "Course",
            "SK": f"Course#{short_uuid}",
            "CourseName": json.loads(event['body'])['courseName'],
            "CourseSlot": json.loads(event['body'])['courseSlot'],
            "TeacherId": json.loads(event['body'])['teacherId']
        }

        response = table.put_item(Item= item)

        return response_200_msg_items("inserted", item)

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
