import sys
import boto3
import json

from global_functions.responses import *
from global_functions.exists_in_db import *
from global_functions.cognito import *

def lambda_handler(event, context):

    try:
        dynamodb = boto3.resource("dynamodb")
        table = dynamodb.Table("LMS")
        studentId = event['queryStringParameters']['studentId']
        contactlist = []

        # check if studentId exists in Cognito
        if not get_user(studentId):
            return response_404('studentId does not exist in Cognito')

        # check for teachers who teach this student
        # 1. get all courses student attends
        student_course_response = table.query(
            KeyConditionExpression="PK = :PK AND begins_with(SK, :SK)",
            ExpressionAttributeValues={
                ":PK": f"Student#{studentId}",
                ":SK": "Course#"
            })

        student_course_items = student_course_response['Items']

        for i in range(len(student_course_items)):
            courseId = student_course_items[i].get("SK").split("#")[1]

            course_response = table.get_item(
                Key={
                  "PK":"Course",
                  "SK": f"Course#{courseId}"
                }
            )

            course_item = course_response['Item']
            teacherId = course_item['TeacherId']
            teacherName = get_user(teacherId)['teacherName']
            contact = {
                'TeacherId': teacherId,
                'TeacherName': teacherName
                }

            if contact not in contactlist:
                contactlist.append(contact)

        return response_200_items(contactlist)

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
