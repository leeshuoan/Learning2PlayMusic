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
        final_response = {}

        userIds = json.loads(event['body'])['userIds']

        for userId in userIds:

            print("userId: ", userId)

            response = []

            user = get_user(userId)
            print("user: ", user)
            if user == None:
                response = {
                    'error': 'userId does not exist in Cognito'
                }
                final_response[userId] = [response]
                continue

            if 'studentId' in user:
                partitionkey = f"Student#{userId}"

            elif 'teacherId' in user:
                partitionkey = f"Teacher#{userId}"

            else:
                response = {
                    'error': 'Please check that you have entered a correct studentId/teacherId'
                }
                final_response[userId] = [response]
                continue

            # get all courses that this student is enrolled in
            db_response = table.query(
                KeyConditionExpression="PK = :PK AND begins_with(SK, :SK)",
                ExpressionAttributeValues={
                    ":PK": partitionkey,
                    ":SK": "Course#"
                })

            items = db_response['Items']

            # for each course, get the course details to append to the above resp
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
                print('course_item before: ', course_item)
                course_item.pop("PK")
                course_item.pop("SK")
                print('course_item after: ', course_item)

                items[i].update(course_item)

            # response.append(items)
            # print("response: ", response)
            final_response[userId] = items
            print("final_response: ", final_response)


        # will always return response 200
        return response_200_items(final_response)

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
