import sys
import boto3
import json

# Get all questions by courseid and quizid
from global_functions.get_presigned_url import *


def lambda_handler(event, context):

    queryStringParameters: dict = event["queryStringParameters"]

    res = {}
    try:
        dynamodb = boto3.resource("dynamodb")
        table = dynamodb.Table("LMS")

        courseId = queryStringParameters["courseId"]
        quizId = queryStringParameters["quizId"]

        # if specific questionid is specified
        if "questionId" in queryStringParameters.keys():
            questionId = queryStringParameters["questionId"]
            response = table.get_item(
                Key={
                    "PK": f"Course#{courseId}",
                    "SK": f"Quiz#{quizId}Question#{questionId}"
                })
            items = response["Item"]
            get_presigned_url(items)
        else:    
            response = table.query(
                KeyConditionExpression="PK= :PK AND begins_with(SK, :SK)",
                ExpressionAttributeValues={
                    ":PK": f"Course#{courseId}",
                    ":SK": f"Quiz#{quizId}Question#"
                })
            items = response["Items"]
            for item in items:
                get_presigned_url(item)


            
        res["statusCode"] = 200
        res["headers"] = {
            "Access-Control-Allow-Headers": "Content-Type",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "POST,GET,PUT"
        }
        res["body"] = json.dumps(items)

        return res

    except Exception as e:
        exception_type, exception_object, exception_traceback = sys.exc_info()
        filename = exception_traceback.tb_frame.f_code.co_filename
        line_number = exception_traceback.tb_lineno
        print("❗Exception type: ", exception_type)
        print("❗File name: ", filename)
        print("❗Line number: ", line_number)
        print("❗Error: ", e)
        return {
            "statusCode": 500,
            "body": f"{exception_type}: {str(e)}",

        }

