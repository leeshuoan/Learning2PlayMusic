import sys
import boto3
import json

from global_functions.responses import *
from global_functions.exists_in_db import *


def lambda_handler(event, context):

    try:
        dynamodb = boto3.resource("dynamodb")
        table = dynamodb.Table("LMS")

        # VALIDATION
        # check if <studentId> exists in database (i.e. student registered in DB)
        studentId = event['queryStringParameters']['studentId']
        if not id_exists("User", "Student", studentId):
            return response_400("studentId does not exist in database.")

        # check if <courseId> exists in database
        courseId = event['queryStringParameters']['courseId']
        if not id_exists("Course", "Course", courseId):
            return response_400("courseId does not exist in database.")

        # check if <studentId><courseId> combination exists in database
        # db won't throw error if try to delete a primary key combination that does not exist,
        # this is more to inform that student was not registered with the course.
        if not combination_id_exists("Student", studentId, "Course", courseId):
            return response_202("This student has not been registered with the course")

        else:
            response = table.delete_item(
                Key={
                    "PK": f"Student#{studentId}",
                    "SK": f"Course#{courseId}"
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
