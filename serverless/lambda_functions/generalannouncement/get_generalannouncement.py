import sys
import boto3
import json

# Get all general announcement
def lambda_handler(event, context):
  
    # Use this if testing from API gateway
    dateId = event["queryStringParameters"]["dateId"]

    # Use this if testing locally on 
    # dateId=event["dateId"]

    res = {}
    try:
        dynamodb = boto3.resource("dynamodb")
        table = dynamodb.Table("LMS")

        response = table.query(
            KeyConditionExpression="PK= :PK AND begins_with(SK, :SK)",
            ExpressionAttributeValues={
                ":PK": f"GeneralAnnouncements",
                ":SK": f"Date#{dateId}"
            })

        items = response["Items"]

        res["statusCode"] = 200
        res["headers"] = {
            "Access-Control-Allow-Headers": "Content-Type",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "POST,GET,PUT"
        }
        res["body"] = json.dumps(items)

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
        return {
            "statusCode": 500,
            "body": str(e),
            
        }