import json
import sys

import boto3
from global_functions.cognito import *
from global_functions.exists_in_db import *
from global_functions.responses import *


def lambda_handler(event, context):
    try:
        # VALIDATION
        requestBody = json.loads(event["body"])
        if requestBody == {}:
            return response_400("request body is empty")

        if "courseId" not in requestBody:
            return response_400("courseId is missing")

        update_expression = "SET "
        expression_attribute_values = {}

        if "courseName" in requestBody:
            update_expression += "CourseName = :courseName, "
            expression_attribute_values[":courseName"] = requestBody["courseName"]

        if "courseSlot" in requestBody:
            update_expression += "CourseSlot = :courseSlot, "
            expression_attribute_values[":courseSlot"] = requestBody["courseSlot"]

        if "teacherId" in requestBody:
            teacherId = requestBody["teacherId"]
            if not get_user(teacherId):
                return response_404("teacherId does not exist in Cognito")
            update_expression += "TeacherId = :teacherId, "
            expression_attribute_values[":teacherId"] = teacherId
        # teacherID must be passed with original to update teacher, remove and delete respectively
        if ("teacherId" in requestBody and "originalTeacherId" not in requestBody) or ("teacherId" not in requestBody and "originalTeacherId" in requestBody):
                    return response_500("teacherId and originalTeacherId must be passed in together")

        dynamodb = boto3.resource("dynamodb")
        table = dynamodb.Table("LMS")
        ## update_items way
        key = {
            "PK": "Course",
            "SK": f"Course#{requestBody['courseId']}",
        }
        print("update_expression: ", update_expression[:-2])
        response = table.update_item(
            Key=key,
            UpdateExpression=update_expression[:-2],
            ExpressionAttributeValues=expression_attribute_values,
        )
        if "teacherId" in requestBody and "originalTeacherId" in requestBody:
            # directly enrol selected teacher into the course
            enrol_item = {
                "PK": f"Teacher#{requestBody['teacherId']}",
                "SK": f"Course#{requestBody['courseId']}"
            }
            table.put_item(Item=enrol_item)
            # unenrol existing teacher
            table.delete_item(
                Key={"PK": f"Teacher#{requestBody['originalTeacherId']}", "SK": f"Course#{requestBody['courseId']}"}
            )

        return response_200_msg_items("updated", response)

        ## put_item way
        # item = {
        #     "PK": "Course",
        #     "SK": f"Course#{json.loads(event['body'])['courseId']}",
        #     "CourseName": json.loads(event["body"])["courseName"],
        #     "CourseSlot": json.loads(event["body"])["courseSlot"],
        #     "TeacherId": json.loads(event["body"])["teacherId"],
        # }
        # response = table.put_item(Item=item)

    # currently, this is only for functions that sends in request body - to catch 'missing fields' error
    except KeyError:
        print("❗Exception Type Caught - KeyError")
        return response_500(
            "One or more field(s) is missing. Please double check that all fields in the model schema are populated."
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
