import json
import sys
import uuid

import boto3
from global_functions.cognito import *
from global_functions.exists_in_db import *
from global_functions.responses import *


def lambda_handler(event, context):

    try:

        # VALIDATION
        # checks that teacherId passed in is not an empty string
        teacher_id = json.loads(event['body'])['teacherId'] if 'teacherId' in json.loads(event['body']) else None
        if teacher_id == "" or teacher_id == None:
            return response_400("teacherId is missing")
        # check if <teacherId> exists in database
        if not get_user(teacher_id):
            return response_404("teacherId does not exist in Cognito")
        
        course_name = json.loads(event['body'])['courseName'] if 'courseName' in json.loads(event['body']) else None
        if course_name == "" or course_name == None:
            return response_400("courseName is missing")
        
        course_slot = json.loads(event['body'])['courseSlot'] if 'courseSlot' in json.loads(event['body']) else None
        if course_slot == "" or course_slot == None:
            return response_400("courseSlot is missing")

        dynamodb = boto3.resource("dynamodb")
        table = dynamodb.Table("LMS")
        short_uuid = str(uuid.uuid4().hex)[:8]

        item = {
            "PK": "Course",
            "SK": f"Course#{short_uuid}",
            "CourseName": course_name,
            "CourseSlot": course_slot,
            "TeacherId": teacher_id
        }

        response = table.put_item(Item= item)

        # directly enrol selected teacher into the course
        enrol_item = {
            "PK": f"Teacher#{teacher_id}",
            "SK": f"Course#{short_uuid}"
        }
        table.put_item(Item=enrol_item)

        return response_200_msg_double_items("inserted", item, "enrolled", enrol_item)

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
