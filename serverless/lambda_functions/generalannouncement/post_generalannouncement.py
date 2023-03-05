import sys
import boto3
import json
from datetime import datetime
import dateutil.tz

from global_functions.responses import *
from global_functions.exists_in_db import *

def lambda_handler(event, context):

    try:
        sgTimezone = dateutil.tz.gettz('Asia/Singapore')
        dateId = datetime.now(tz=sgTimezone).strftime("%Y-%m-%dT%H:%M:%S")

        dynamodb = boto3.resource("dynamodb")
        table = dynamodb.Table("LMS")

        item = {
                "PK": f"GeneralAnnouncements",
                "SK": f"Date#{dateId}",
                "Content": json.loads(event['body'])['content'],
                "Title": json.loads(event['body']['title'])
            }

        response = table.put_item(Item= item)

        return response_200_msg_items("inserted", item)

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