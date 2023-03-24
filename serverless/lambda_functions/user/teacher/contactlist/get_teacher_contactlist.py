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
        teacherId = event['queryStringParameters']['teacherId']
        contactlist = []

        # check if teacherId exists in Cognito
        if not get_user(teacherId):
            return response_404('teacherId does not exist in Cognito')

        teacher_course_response = table.query(
            KeyConditionExpression="PK = :PK AND begins_with(SK, :SK)",
            ExpressionAttributeValues={
                ":PK": f"Teacher#{teacherId}",
                ":SK": "Course#"
            })

        teacher_course_items = teacher_course_response['Items']

        for i in range(len(teacher_course_items)):
            courseId = teacher_course_items[i].get("SK").split("#")[1]

            response = table.query(
                IndexName="SK-PK-index",
                KeyConditionExpression="SK = :SK AND begins_with(PK, :PK)",
                ExpressionAttributeValues={
                    ":SK": f"Course#{courseId}",
                    ":PK": f"Student#"
                })

            items = response["Items"]

            for item in items:
                studentId = item['studentId'].split('#')[1]
                studentName = get_user(studentId)['studentName']
                student = {
                    'StudentId': studentId,
                    'StudentName': studentName
                }

                if student not in contactlist:
                    contactlist.append(student)


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
