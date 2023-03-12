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

        # VALIDATION
        # checks that courseId passed in is not an empty string
        if json.loads(event['body'])['courseId']=="" or json.loads(event['body'])['materialId']=="":
            return response_400("courseId or materialId is missing")

        # check if <courseId> exists in database
        courseId = json.loads(event['body'])['courseId']
        if not id_exists("Course", "Course", courseId):
            return response_404("courseId does not exist in database")

        # check if <materialId> exists in database
        materialId = json.loads(event['body'])['materialId']
        if not combination_id_exists("Course", courseId, "Material", materialId):
            return response_404("materialId does not exist in database")


        item = {
                "PK": f"Course#{courseId}",
                "SK": f"Material#{materialId}",
                "MaterialLessonDate": json.loads(event['body'])['materialLessonDate'],
                "MaterialLink": json.loads(event['body'])['materialLink'],
                "MaterialS3Link": json.loads(event['body'])['materialS3Link'],
                "MaterialTitle": json.loads(event['body'])['materialTitle'],
                "MaterialType": json.loads(event['body'])['materialType']

            }

        response = table.put_item(Item= item)

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