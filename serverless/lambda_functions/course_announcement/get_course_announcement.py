import sys
import boto3
import json

from global_functions.responses import *
from global_functions.exists_in_db import *


def lambda_handler(event, context):

    try:
        dynamodb = boto3.resource("dynamodb")
        table = dynamodb.Table("LMS")

        courseId = event['queryStringParameters']['courseId']

        # VALIDATION
        # check if <courseId> exists in database
        if not id_exists("Course", "Course", courseId):
            return response_400("courseId does not exist in database")

        if 'announcementId' not in event['queryStringParameters']:
            sortKey = "Announcement#"
        else:
            announcementId = event['queryStringParameters']['announcementId']
            sortKey = "Announcement#" + announcementId

            # check if <courseId><announcementId> exists in database
            if not combination_id_exists("Course", courseId, "Announcement", announcementId):
                return response_400("announcementId does not exist in database")

        response = table.query(
            KeyConditionExpression="PK = :PK AND begins_with(SK, :SK)",
            ExpressionAttributeValues={
                ":PK": f"Course#{courseId}",
                ":SK": sortKey
            })

        items = response["Items"]

        return response_200_GET(items)

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
