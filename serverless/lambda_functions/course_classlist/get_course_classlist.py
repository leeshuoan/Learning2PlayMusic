import sys
import boto3
import json

from global_functions.responses import *
from global_functions.exists_in_db import *

def lambda_handler(event, context):

    try:

        courseId = event['queryStringParameters']['courseId']

        dynamodb = boto3.resource("dynamodb")
        table = dynamodb.Table("LMS")

        # VALIDATION
        # check if <courseId> exists in database
        if not id_exists("Course", "Course", courseId):
            return response_404("courseId does not exist in database")

        ####################################
        ### GET STUDENT'S ID (not names) ###
        ####################################
        response = table.query(
            IndexName="SK-PK-index",
            KeyConditionExpression="SK = :SK AND begins_with(PK, :PK)",
            ExpressionAttributeValues={
                ":SK": f"Course#{courseId}",
                ":PK": "Student#"
            })

        student_items = response["Items"]

        for student in student_items:

            studentId = student['PK'].split("#")[1]

            #######################
            ### GET QUIZ SCORES ###
            #######################

            quiz_response = table.query(
                KeyConditionExpression="PK = :PK AND begins_with(SK, :SK)",
                ExpressionAttributeValues={
                    ":PK": f"Course#{courseId}",
                    ":SK": f"Student#{studentId}Quiz"
                })

            quiz_items = quiz_response['Items']

            total_quiz_score = 0
            for quiz in quiz_items:
                quiz_score = float(quiz['QuizScore'])
                total_quiz_score += quiz_score

            student['QuizScore'] = total_quiz_score

            ###########################
            ### GET HOMEWORK SCORES ###
            ###########################

            homework_response = table.query(
                KeyConditionExpression="PK = :PK AND begins_with(SK, :SK)",
                ExpressionAttributeValues={
                    ":PK": f"Course#{courseId}",
                    ":SK": f"Student#{studentId}Homework"
                })

            homework_items = homework_response['Items']

            total_homework_score = 0
            for homework in homework_items:
                homework_score = float(homework['HomeworkScore'])
                total_homework_score += homework_score

            student['HomeworkScore'] = total_homework_score

            ###########################
            ### GET PROGRESS REPORT ###
            ###########################

        return response_200_items(student_items)


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
