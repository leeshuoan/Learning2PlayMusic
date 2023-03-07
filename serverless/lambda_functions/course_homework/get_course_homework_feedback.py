import sys
import boto3
import json
import decimal

# Get all homework by courseid

from global_functions.responses import *
from global_functions.get_presigned_url import get_presigned_url

class Encoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, decimal.Decimal): return float(obj)

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
                    "PK": f"Course#{courseId}",
                    "SK": f"Student#{studentId}Homework#{homeworkId}"
                })
            if "Item" not in response:
                raise Exception("No such courseid/studentid/homeworkid")
            
            items = response["Item"]
            get_presigned_url(items, "HomeworkAttachment")


        else:
            response = table.query(
                KeyConditionExpression="PK= :PK AND begins_with(SK, :SK)",
                ExpressionAttributeValues={
                    ":PK": f"Course#{courseId}",
                    ":SK": f"Student#{studentId}Homework#"
                })
            items = response["Items"]
            for item in items:
                get_presigned_url(item, "HomeworkAttachment")



        res["statusCode"] = 200
        res["headers"] = {
            "Access-Control-Allow-Headers": "Content-Type",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "POST,GET,PUT"
        }
        res["body"] = json.dumps(items, cls = Encoder)

        return res

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