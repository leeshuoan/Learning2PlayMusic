import sys
import boto3
import json

from global_functions.responses import *
from global_functions.exists_in_db import *

def lambda_handler(event, context):

    try:
        dynamodb = boto3.resource("dynamodb")
        table = dynamodb.Table("LMS")

        # check if <courseId> exists in database
        courseId = event['queryStringParameters']['courseId']
        if not course_id_exists(courseId):
            return response_400("courseId does not exist in database")

        # check if <materialId> exists in database
        materialId = event['queryStringParameters']['materialId']
        if not course_item_id_exists(courseId, "Material", materialId):
            return response_400("materialId does not exist in database")

        response = table.delete_item(
            Key= {
                "PK": f"Course#{event['queryStringParameters']['courseId']}",
                "SK": f"Material#{event['queryStringParameters']['materialId']}"
            }
            )

        return response_200("successfully deleted item")


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
