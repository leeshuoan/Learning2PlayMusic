import sys
import boto3
import json

from global_functions.responses import *

def lambda_handler(event, context):

    try:
        dynamodb = boto3.resource("dynamodb")
        table = dynamodb.Table("LMS")

        courseId = event['queryStringParameters']['courseId']

        if 'materialId' not in event['queryStringParameters']:
            sortKey = "Material#"
        else:
            materialId = event['queryStringParameters']['materialId']
            sortKey = "Material#" + materialId

        response = table.query(
            KeyConditionExpression="PK = :PK AND begins_with(SK, :SK)",
            ExpressionAttributeValues={
                ":PK": f"Course#{courseId}",
                ":SK": sortKey
            })

        items = response["Items"]

        return {
            "statusCode": 200,
            "headers": {
                "Access-Control-Allow-Headers": "Content-Type",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "POST,GET,DELETE"
            },
            "body": json.dumps(items)
        }

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
