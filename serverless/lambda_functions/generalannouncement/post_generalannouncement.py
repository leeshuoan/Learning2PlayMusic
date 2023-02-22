import sys
import boto3
import json
import uuid


# Add a new course announcement under a course
def lambda_handler(event, context):
  
    dateId = str(uuid.uuid4().hex)[:8]
    content = event["queryStringParameters"]["content"]
    res = {}
    try:
        dynamodb = boto3.resource("dynamodb")
        table = dynamodb.Table("LMS")

        table.put_item(
            Item={
                "PK": f"GeneralAnnouncement#",
                "SK": f"Date#{dateId}",
                "Content": content,
            })

        res["statusCode"] = 200
        res["headers"] = {
            "Access-Control-Allow-Headers": "Content-Type",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "POST,GET,PUT"
        }
        res["body"] = json.dumps({"message": "Announcement added successfully"})

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
            "body": str(e)
        }
