import sys

import boto3
from boto3.dynamodb.conditions import Key
from global_functions.exists_in_db import *
from global_functions.responses import *


def lambda_handler(event, context):

    try:

        # VALIDATION
        # check if <courseId> exists in database
        courseId = event["queryStringParameters"]["courseId"]
        if not id_exists("Course", "Course", courseId):
            return response_404("courseId does not exist in database")

        dynamodb = boto3.resource("dynamodb")
        table = dynamodb.Table("LMS")

        # Query the database for all items related to the courseId
        response = table.query(
            KeyConditionExpression=Key("PK").contains(f"Course#{courseId}")
            & Key("SK").contains(f"Course#{courseId}")
        )

        with table.batch_writer() as batch:
            # Delete all items related to the courseId in the database
            for item in response["Items"]:
                batch.delete_item(Key=item)

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
