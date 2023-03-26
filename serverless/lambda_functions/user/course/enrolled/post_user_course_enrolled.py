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
        students_response = {}
        teachers_response = {}
        final_response = {
            'Students': students_response,
            'Teachers': teachers_response
        }

        userIds = event['body']['userIds']

        for userId in userIds:
            
            response = {}
            response['userId'] = userId

            user = get_user(userId)
            if not user:
                response['isSuccessful'] = False
                response['errorMessage'] = 'userId does not exist in Cognito'
            
            if 'studentId' in user:
                partitionkey = f"Student#{userId}"
        
            elif 'teacherId' in user:
                partitionkey = f"Teacher#{userId}"

            else:
                response['isSuccessful'] = False
                response['errorMessage'] = 'Please check that you have entered a correct studentId/teacherId'

            # get all courses that this student is enrolled in
            db_response = table.query(
                KeyConditionExpression="PK = :PK AND begins_with(SK, :SK)",
                ExpressionAttributeValues={
                    ":PK": partitionkey,
                    ":SK": "Course#"
                })
        
            items = db_response['Items']

            # for each course, get the course details to append to the above response
            for i in range(len(items)):
                print("i: ", i)
                courseId = items[i].get("SK").split("#")[1]

                course_response = table.get_item(
                    Key={
                      "PK":"Course",
                      "SK": f"Course#{courseId}"
                    }
                )

                course_item = course_response['Item']
                course_item.pop("PK")
                course_item.pop("SK")

                items[i].update(course_item)

                print("response: ", response)
                print("items[i]: ", items[i])


        # will always return response 200
        return response_200_items(items)

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
