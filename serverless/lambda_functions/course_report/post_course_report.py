import json
import sys
import uuid
from datetime import datetime

import boto3
from global_functions.exists_in_db import *
from global_functions.responses import *

dynamodb = boto3.resource("dynamodb")
table = dynamodb.Table("LMS")

def lambda_handler(event, context):
    try:
        request_body = json.loads(event['body'])
        course_id = request_body['courseId'] if 'courseId' in request_body else None
        student_id = request_body['studentId'] if 'studentId' in request_body else None
        available_date = request_body['availableDate'] if 'availableDate' in request_body else None

        if available_date is None or course_id is None:
            return response_400("courseId or availableDate is missing")
        
        if not id_exists("Course", "Course", course_id):
            return response_404("courseId does not exist in database")

        month = datetime.fromisoformat(available_date.replace("Z",'+00:00')).strftime("%B")
        year  = datetime.fromisoformat(available_date.replace("Z",'+00:00')).strftime("%Y")
        # single student
        if student_id != None or student_id != "":
            # check if <studentId> has been registered with <courseId>]
            if not combination_id_exists("Course", course_id, "Student", student_id):
                return response_404("studentId is not registered with the course. To do so, please use /user/course to register")
            report_response = generate_report(course_id, student_id, month, year, available_date)
            return response_200_msg_items("report generated", report_response)
        # multiple students
        else:
            output = []
            response = table.query(
                KeyConditionExpression="PK = :PK AND begins_with(SK, :SK)",
                ExpressionAttributeValues={
                    ":PK": f"Course#{course_id}",
                    ":SK": f"Student#"
                })
            students = response['Items']
            for student in students:
                stu_id = student['SK'].split('#')[1]
                report_response = generate_report(course_id, stu_id, month, year, available_date)
                output.append(report_response)
                # get count of reports for this student
            return response_200_msg_items("report generated", output)

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


def generate_report(course_id, student_id, month, year, available_date):
    report_id = str(uuid.uuid4().hex)[:8]
    evaluation_list = {
        'posture': '',
        'rhythm': '',
        'toneQuality': '',
        'dynamicsControl': '',
        'articulation': '',
        'sightReading': '',
        'practice': '',
        'theory': '',
        'scales': '',
        'aural': '',
        'musicality': '',
        'performing': '',
        'enthusiasm': '',
        'punctuality': '',
        'attendance': ''
    }
    item = {
            "PK": f"Course#{course_id}",
            "SK": f"Student#{student_id}Report#{report_id}",
            "EvaluationList": evaluation_list,
            "Title": f"Student Progress Report for {month} {year}",
            'AvailableDate': available_date,
            'UpdatedDate': "",
            "GoalsForNewTerm": '',
            "AdditionalComments": '',
        }
    response = table.put_item(Item=item)
    return response