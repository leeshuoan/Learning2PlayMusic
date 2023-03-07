import sys
import boto3
import json
import uuid

from global_functions.responses import *
from global_functions.exists_in_db import *

def lambda_handler(event, context):

    try:

        # VALIDATION
        # check if <teacherId> exists in database (i.e. teacher registered in DB)
        teacherId = event['queryStringParameters']['teacherId']
        if not id_exists("User", "Teacher", teacherId):
            return response_404("teacherId does not exist in database.")

        # check if <courseId> exists in database
        courseId = event['queryStringParameters']['courseId']
        if not id_exists("Course", "Course", courseId):
            return response_404("courseId does not exist in database.")

        # check if <teacherId><courseId> combination exists in database
        # db won't throw error if try to reinsert same primary key, this is more to inform that teacher is already registered with the course
        if combination_id_exists("Teacher", teacherId, "Course", courseId):
            return response_202_msg("This teacher has been registered with the course")

        else:
            dynamodb = boto3.resource("dynamodb")
            table = dynamodb.Table("LMS")
            short_uuid = str(uuid.uuid4().hex)[:8]

            item = {
                    "PK": f"Teacher#{teacherId}",
                    "SK": f"Course#{courseId}"
                }

            response = table.put_item(Item=item)

            return response_200_msg_items("inserted", item)

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
