import sys
import boto3
import json

from global_functions.get_presigned_url import *
from global_functions.responses import *
from global_functions.exists_in_db import *


def lambda_handler(event, context):

    try:
        dynamodb = boto3.resource("dynamodb")
        table = dynamodb.Table("LMS")
        queryStringParameters: dict = event["queryStringParameters"]
        courseId = event['queryStringParameters']['courseId']

        # if specific materialId is specified
        if "materialId" in queryStringParameters.keys():
            materialId = queryStringParameters["materialId"]
            response = table.get_item(
                Key={
                    "PK": f"Course#{courseId}",
                    "SK": f"Material#{materialId}"
                })
            items = response["Item"]
            if "MaterialAttachment" in items and items["MaterialAttachment"] != "":
                get_presigned_url(items, "MaterialAttachment")
        else:
            response = table.query(
                KeyConditionExpression="PK= :PK AND begins_with(SK, :SK)",
                ExpressionAttributeValues={
                    ":PK": f"Course#{courseId}",
                    ":SK": f"Material#"
                })
            items = response["Items"]
            for item in items:
                if "MaterialAttachment" in items and items["MaterialAttachment"] != "":
                    get_presigned_url(item, "MaterialAttachment")

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

        return response_500(e)
