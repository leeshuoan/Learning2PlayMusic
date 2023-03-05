import sys
import boto3
import json

# Get all homework by courseid

from global_functions.responses import *


def lambda_handler(event, context):

    queryStringParameters: dict = event["queryStringParameters"]
    res = {}
    try:
        dynamodb = boto3.resource("dynamodb")
        table = dynamodb.Table("LMS")

        courseId = queryStringParameters["courseId"]
        studentId = queryStringParameters["studentId"]

        # if specific homeworkId is specified
        if "homeworkId" in queryStringParameters.keys():
            homeworkId = queryStringParameters["homeworkId"]
            response = table.get_item(
                Key={
                    ":PK": f"Course#{courseId}",
                    ":SK": f"Student#{studentId}Homework#{homeworkId}"
                })
        else:
            response = table.query(
                KeyConditionExpression="PK= :PK AND begins_with(SK, :SK)",
                ExpressionAttributeValues={
                    ":PK": f"Course#{courseId}",
                    ":SK": f"Student#{studentId}Homework#"
                })

        items = response["Items"]


        return response_200_items(items)

    except Exception as e:
        # print(f".......... 🚫 UNSUCCESSFUL: Failed request for Course ID: {courseId} 🚫 ..........")
        exception_type, exception_object, exception_traceback = sys.exc_info()
        filename = exception_traceback.tb_frame.f_code.co_filename
        line_number = exception_traceback.tb_lineno
        print("❗Exception type: ", exception_type)
        print("❗File name: ", filename)
        print("❗Line number: ", line_number)
        print("❗Error: ", e)
        return response_500((str(exception_type) + str(e)))
