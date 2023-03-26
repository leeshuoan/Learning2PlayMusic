import sys
import boto3
import json
import decimal

from global_functions.responses import *


class Encoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, decimal.Decimal):
            return float(obj)

# Get all quizzes by courseid


def lambda_handler(event, context):

    queryStringParameters: dict = event["queryStringParameters"]
    res = {}
    try:
        dynamodb = boto3.resource("dynamodb")
        table = dynamodb.Table("LMS")

        courseId = queryStringParameters["courseId"]

        if "studentId" not in queryStringParameters.keys():
            items = handle_general_course_quiz(
                courseId, table, queryStringParameters)

        else:
            studentId = queryStringParameters["studentId"]
            items = handle_student_course_quiz(
                courseId, studentId, table, queryStringParameters)

        res["statusCode"] = 200
        res["headers"] = {
            "Access-Control-Allow-Headers": "Content-Type",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "POST,GET,PUT"
        }
        res["body"] = json.dumps(items, cls=Encoder)

        return res

    except Exception as e:
        # print(f".......... 🚫 UNSUCCESSFUL: Failed request for Course ID: {courseId} 🚫 ..........")
        exception_type, exception_object, exception_traceback = sys.exc_info()
        filename = exception_traceback.tb_frame.f_code.co_filename
        line_number = exception_traceback.tb_lineno
        print("❗Exception type: ", exception_type)
        print("❗File name: ", filename)
        print("❗Line number: ", line_number)
        print("❗Error: ", e)
        if exception_type == KeyError:
            return response_404("Id not found")
        return response_500((str(exception_type) + str(e)))


def handle_general_course_quiz(courseId, table, queryStringParameters):
    if "quizId" in queryStringParameters.keys():
        quizId = queryStringParameters["quizId"]
        response = table.get_item(
            Key={
                "PK": f"Course#{courseId}",
                "SK": f"Quiz#{quizId}"
            })
        items = response["Item"]

    else:
        response = table.query(
            KeyConditionExpression="PK= :PK AND begins_with(SK, :SK)",
            FilterExpression='Visibility= :visibility',
            ExpressionAttributeValues={
                ":PK": f"Course#{courseId}",
                ":SK": f"Quiz#",
                ":visibility": False
            }

        )
        items = response["Items"]

    return items


def handle_student_course_quiz(courseId, studentId, table, queryStringParameters):
    if "quizId" in queryStringParameters.keys():
        quizId = queryStringParameters["quizId"]
        response = table.get_item(
            Key={
                "PK": f"Course#{courseId}",
                "SK": f"Student#{studentId}Quiz#{quizId}"
            })
        items = response["Item"]

    else:
        response = table.query(
            KeyConditionExpression="PK= :PK AND begins_with(SK, :SK)",
            FilterExpression='Visibility= :visibility',
            ExpressionAttributeValues={
                ":PK": f"Course#{courseId}",
                ":SK": f"Student#{studentId}Quiz#",
                ":visibility": False
            },
        )
        items = response["Items"]

    return items
