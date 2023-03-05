import sys
import boto3
import json
import uuid

from global_functions.responses import *
from global_functions.exists_in_db import *

def lambda_handler(event, context):

    try:

        # VALIDATION
        # checks that <studentId> passed in is not an empty string
        if json.loads(event['body'])['studentId']=="":
            return response_400("studentId is missing")

        # check if <studentId> exists in database
        studentId = json.loads(event['body'])['studentId']
        if not id_exists("User", "Student", studentId):
            return response_404("studentId does not exist in database")
        
        # check if <studentId> has been soft-deleted in database
        dynamodb = boto3.resource("dynamodb")
        table = dynamodb.Table("LMS")

        response = table.query(
            KeyConditionExpression="PK = :PK AND SK = :SK",
            ExpressionAttributeValues={
                ":PK": "User",
                ":SK": f"Student#{studentId}"
            }
            )

        items = response["Items"]
        if items['isSoftDeleted'] == True:
            return response_409("studentId has been soft-deleted")

        item = {
            "PK": "User",
            "SK": f"Student#{studentId}",
            "FirstName": json.loads(event['body'])['firstName'],
            "LastName": json.loads(event['body'])['lastName'],
            "ContactNumber": json.loads(event['body'])['contactNumber'],
            "isSoftDeleted": json.loads(event['body'])['isSoftDeleted']
        }

        response = table.put_item(Item= item)

        return response_200_msg_items("updated", item)

    # currently, this is only for functions that sends in request body - to catch 'missing fields' error
    except KeyError:
        print("❗Exception Type Caught - KeyError")
        return response_500("One or more field(s) is missing. Please double check that all fields in the model schema are populated.")

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
