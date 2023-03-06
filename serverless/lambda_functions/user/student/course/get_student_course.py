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
        # check if <studentId> exists in database
        studentId = event['queryStringParameters']['studentId']
        if not id_exists("User", "Student", studentId):
            return response_404("studentId does not exist in database")

        response = table.query(
            KeyConditionExpression="PK = :PK AND begins_with(SK, :SK)",
            ExpressionAttributeValues={
                ":PK": f"Student#{studentId}",
                ":SK": "Course#"
            })
        
        courses = []

        for course in response["Items"]:
            courseInfos = table.query(
                KeyConditionExpression="PK = :PK AND begins_with(SK, :SK)",
                ExpressionAttributeValues={
                    ":PK": "Course",
                    ":SK": course["SK"]
                }
            )
            courses.append(courseInfos["items"][0])

        return response_200_items(courses)

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
