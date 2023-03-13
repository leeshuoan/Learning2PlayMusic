import sys
import boto3
import json

from global_functions.responses import *
from global_functions.exists_in_db import *

def lambda_handler(event, context):

    try:
        dynamodb = boto3.resource("dynamodb")
        table = dynamodb.Table("LMS")
        request_body: dict = json.loads(event['body'])

        # VALIDATION
        # check if <courseId> exists in database
        course_id = request_body['courseId']
        if not id_exists("Course", "Course", course_id):
            return response_404("courseId does not exist in database")

        # check if <materialId> exists in database
        material_id = request_body['materialId']
        if not combination_id_exists("Course", course_id, "Material", material_id):
            return response_404("materialId does not exist in database")

        response = table.delete_item(
            Key= {
                "PK": f"Course#{course_id}",
                "SK": f"Material#{material_id}"
            }
            )

        return response_200_msg("successfully deleted item")


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
