import sys
import boto3
import json
import uuid

def lambda_handler(event, context):
    
    try:
      dynamodb = boto3.resource("dynamodb")
      table = dynamodb.Table("LMS")
      short_uuid = str(uuid.uuid4().hex)[:8]

      response = table.put_item(
          Item= {
              "PK": "Course",
              "SK": f"Course#{short_uuid}",
              "CourseEndDate": f"{event['queryStringParameters']['courseEndDate']}",
              "CourseName": f"{event['queryStringParameters']['courseName']}",
              "CourseTimeSlot": f"{event['queryStringParameters']['courseTimeSlot']}"
          }
          )

      return {
          "statusCode": 200,
          "headers": {
              "Access-Control-Allow-Headers": "Content-Type",
              "Access-Control-Allow-Origin": "*",
              "Access-Control-Allow-Methods": "POST,GET,PUT"
          },
          "body": "Successfully inserted item!"
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
      return {
        "statusCode": 500,
        "body": str(e),

      }