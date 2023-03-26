import sys
import boto3
import json

from global_functions.responses import *
from global_functions.exists_in_db import *
from global_functions.cognito import *

def lambda_handler(event, context):

    return {
        "statusCode": 418, # I'm a teapot
        "headers": {
            "Access-Control-Allow-Headers": "Content-Type",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "POST,GET,DELETE,PUT"
        },
        "body": json.dumps("I'm a teapot")
    }

    # try:
    #     dynamodb = boto3.resource("dynamodb")
    #     table = dynamodb.Table("LMS")

    #     # VALIDATION
    #     # check if teacherId exists in Cognito
    #     teacherId = event['queryStringParameters']['teacherId']
    #     if not get_user(teacherId):
    #         return response_404('teacherId does not exist in Cognito')

    #     teacher_course_response = table.query(
    #         KeyConditionExpression="PK = :PK AND begins_with(SK, :SK)",
    #         ExpressionAttributeValues={
    #             ":PK": f"Teacher#{teacherId}",
    #             ":SK": "Course#"
    #         })
        
    #     teacher_course_items = teacher_course_response['Items']
    #     for i in range(len(teacher_course_items)):
    #         courseId = teacher_course_items[i].get("SK").split("#")[1]

    #         course_response = table.get_item(
    #             Key={
    #               "PK":"Course",
    #               "SK": f"Course#{courseId}"
    #             }
    #         )

    #         course_item = course_response['Item']
    #         course_item.pop("PK")
    #         course_item.pop("SK")

    #         teacher_course_items[i].update(course_item)

    #     return response_200_items(teacher_course_items)

    # except Exception as e:
    #     # print(f".......... 🚫 UNSUCCESSFUL: Failed request for Course ID: {courseId} 🚫 ..........")
    #     exception_type, exception_object, exception_traceback = sys.exc_info()
    #     filename = exception_traceback.tb_frame.f_code.co_filename
    #     line_number = exception_traceback.tb_lineno
    #     print("❗Exception type: ", exception_type)
    #     print("❗File name: ", filename)
    #     print("❗Line number: ", line_number)
    #     print("❗Error: ", e)

    #     return response_500(e)
