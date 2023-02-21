import sys
import boto3
import json
import uuid

from global_functions.responses import *
from global_functions.exists_in_db import *

def lambda_handler(event, context):

    try:
        dynamodb = boto3.resource("dynamodb")
        table = dynamodb.Table("LMS")
        short_uuid = str(uuid.uuid4().hex)[:8]

        # checks that courseId passed in is not an empty string
        if json.loads(event['body'])['courseId']=="":
            return response_400("courseId is missing")

        # check if <courseId> already exists in database
        courseId = json.loads(event['body'])['courseId']
        if not course_id_exists(courseId):
            return response_400("courseId does not exists in database")

        response = table.put_item(
            Item= {
                "PK": f"Course#{json.loads(event['body'])['courseId']}",
                "SK": f"Material#{short_uuid}",
                "MaterialLessonDate": json.loads(event['body'])['materialLessonDate'],
                "MaterialLink": json.loads(event['body'])['materialLink'],
                "MaterialS3Link": json.loads(event['body'])['materialS3Link'],
                "MaterialTitle": json.loads(event['body'])['materialTitle'],
                "MaterialType": json.loads(event['body'])['materialType']

            }
            )

        return response_200("successfully inserted item")

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