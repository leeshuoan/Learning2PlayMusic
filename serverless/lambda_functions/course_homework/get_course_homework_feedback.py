import sys
import boto3
import json
import decimal

# Get all homework by courseid

from global_functions.responses import *
from global_functions.get_presigned_url import get_presigned_url


class Encoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, decimal.Decimal):
            return float(obj)


def lambda_handler(event, context):

    queryStringParameters: dict = event["queryStringParameters"]
    res = {}
    try:
        dynamodb = boto3.resource("dynamodb")
        table = dynamodb.Table("LMS")
        course_id = queryStringParameters["courseId"]

        # if studentid specified: handleStudentHomework
        if "studentId" in queryStringParameters:
            student_id = queryStringParameters["studentId"]
            return get_single_student_homework(course_id, student_id, queryStringParameters, table)

        else:
            return get_all_student_homework(course_id, queryStringParameters, table)

    except Exception as e:
        # print(f".......... 🚫 UNSUCCESSFUL: Failed request for Course ID: {courseId} 🚫 ..........")
        exception_type, exception_object, exception_traceback = sys.exc_info()
        filename = exception_traceback.tb_frame.f_code.co_filename
        line_number = exception_traceback.tb_lineno
        print("❗Exception type: ", exception_type)
        print("❗File name: ", filename)
        print("❗Line number: ", line_number)
        print("❗Error: ", e)
        return response_500((str(exception_type) + str(e) + "in line" + str(line_number)))


def get_single_student_homework(course_id, student_id, queryStringParameters, table):

    # if specific homeworkId is specified
    res = {}
    if "homeworkId" in queryStringParameters.keys():
        homework_id = queryStringParameters["homeworkId"]
        response = table.get_item(
            Key={
                "PK": f"Course#{course_id}",
                "SK": f"Student#{student_id}Homework#{homework_id}"
            })
        if "Item" not in response:
            raise Exception("No such courseid/studentid/homeworkid")

        items = response["Item"]
        if items['HomeworkAttachment'] != "":
            get_presigned_url(items, "HomeworkAttachment")

    else:
        response = table.query(
            KeyConditionExpression="PK= :PK AND begins_with(SK, :SK)",
            ExpressionAttributeValues={
                ":PK": f"Course#{course_id}",
                ":SK": f"Student#{student_id}Homework#"
            })
        items = response["Items"]
        for item in items:
            if item['HomeworkAttachment'] != "":
                get_presigned_url(item, "HomeworkAttachment")

    res["statusCode"] = 200
    res["headers"] = {
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST,GET,PUT"
    }
    res["body"] = json.dumps(items, cls=Encoder)

    return res


def get_all_student_homework(course_id, queryStringParameters, table):

    res = {}
    students_response = table.query(
        IndexName="SK-PK-index",
        KeyConditionExpression="SK = :SK AND begins_with(PK, :PK)",
        ExpressionAttributeValues={
            ":SK": f"Course#{course_id}",
            ":PK": "Student#"
        })

    students = students_response["Items"]

    items = []
    if "homeworkId" in queryStringParameters.keys():
        homework_id = queryStringParameters["homeworkId"]
        for student in students:
            student_id = student["PK"].split("#")[1]
            response = table.get_item(
                Key={
                    "PK": f"Course#{course_id}",
                    "SK": f"Student#{student_id}Homework#{homework_id}"
                })
            if "Item" not in response:
                continue
            items.append(response["Item"])
        for item in items:
            if item['HomeworkAttachment'] != "":
                get_presigned_url(item, "HomeworkAttachment")

    else:
        for student in students:
            student_id = student["PK"].split("#")[1]
            response = table.query(
                KeyConditionExpression="PK= :PK AND begins_with(SK, :SK)",
                ExpressionAttributeValues={
                    ":PK": f"Course#{course_id}",
                    ":SK": f"Student#{student_id}Homework#"
                })
            items.append(response["Items"])
        for item in items:
            for homework in item:
                if homework['HomeworkAttachment'] != "":
                    get_presigned_url(item, "HomeworkAttachment")

    res["statusCode"] = 200
    res["headers"] = {
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST,GET,PUT"
    }
    res["body"] = json.dumps(items, cls=Encoder)

    return res
