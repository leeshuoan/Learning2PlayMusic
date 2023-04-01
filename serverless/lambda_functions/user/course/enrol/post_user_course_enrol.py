import json
import sys

import boto3
from global_functions.cognito import *
from global_functions.exists_in_db import *
from global_functions.responses import *


def lambda_handler(event, context):

    try:
        # check if userIds are in request body
        request_body = json.loads(event["body"])

        if "userIds" not in request_body:
            return response_400("userIds not in request body.")
        # check if courseId is in request body
        if "courseId" not in request_body:
            return response_400("courseId not in request body.")
        # validate course existence
        courseId = request_body["courseId"]
        if not id_exists("Course", "Course", courseId):
            return response_404("courseId does not exist in database.")

        already_enrolled = []
        enrolled = []
        does_not_exist = []
        userIds = request_body["userIds"]

        dynamodb = boto3.resource("dynamodb")
        table = dynamodb.Table("LMS")
        with table.batch_write_items() as batch:
            for userId in userIds:
                user = get_user(userId)
                if not user:
                    does_not_exist.append(userId)
                # check user type
                if "studentId" in user:
                    userType = "Student"
                else:
                    userType = "Teacher"
                # check if <userId><courseId> combination exists in database
                if combination_id_exists(userType, userId, "Course", courseId):
                    already_enrolled.append(userId)
                # does not exist, so enrol
                else:
                    enrolled.append(userId)
                    item = {"PK": f"{userType}#{userId}", "SK": f"Course#{courseId}"}
                    batch.put_item(Item=item)

        return (
            response_200_items({"enrolled": enrolled})
            if already_enrolled == [] and does_not_exist == []
            else response_202_msg_custom_items(
                {
                    "enrolled": enrolled,
                    "alreadyEnrolled": already_enrolled,
                    "doesNotExist": does_not_exist,
                }
            )
        )

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
