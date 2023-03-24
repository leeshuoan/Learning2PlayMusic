import sys
import boto3
import json

from global_functions.responses import *
from global_functions.exists_in_db import *
from global_functions.cognito import *

dynamodb = boto3.resource("dynamodb")
table = dynamodb.Table("LMS")

def lambda_handler(event, context):

    try:
        userId = event['queryStringParameters']['userId']

        if not userId:
            return response_404('userId does not exist in Cognito')

        user = get_user(userId)
        admins = get_users('Admins')
        students = get_users('Users')
        teachers = get_users('Teachers')
        contactlist = []

        if 'studentId' in user:
          for teacher in teachers:
            if check_student_teacher_pairing(user['studentId'], teacher['teacherId']) and teacher['teacherId']!=userId:
                contactlist.append(teacher)

        elif 'teacherId' in user:
          for student in students:
              if check_student_teacher_pairing(student['studentId'], user['teacherId']) and student['studentId']!=userId:
                  contactlist.append(student)

        else: # is admin
          [contactlist.append(admin) for admin in admins if admin['adminId']!=userId]
          [contactlist.append(teacher) for teacher in teachers if teacher['teacherId']!=userId]
          [contactlist.append(student) for student in students if student['studentId']!=userId]

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

def check_student_teacher_pairing(studentId, teacherId):

    # get all course taught by teacher
    response = table.query(
        KeyConditionExpression="PK= :PK AND begins_with(SK, :SK)",
        ExpressionAttributeValues={
            ":PK": f"Teacher#{teacherId}",
            ":SK": f"Course#"
        })
    items = response["Items"]

    # check if for each course the teacher teaches, whether the student is in the course
    for item in items:
        courseId = item['SK'].split("#")[1]

        student = table.get_item(
              Key={
                  "PK": f"Student#{studentId}",
                  "SK": f"Course#{courseId}"
              })

        if 'Item' in student:
            return True

    return False
