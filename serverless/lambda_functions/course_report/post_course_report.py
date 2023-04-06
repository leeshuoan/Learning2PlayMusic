import sys
import boto3
import json
from datetime import datetime
import dateutil.tz


from global_functions.responses import *
from global_functions.exists_in_db import *


def lambda_handler(event, context):

    try:
        dynamodb = boto3.resource("dynamodb")
        table = dynamodb.Table("LMS")

        sg_timezone = dateutil.tz.gettz('Asia/Singapore')
        year = datetime.now(tz=sg_timezone).strftime("%Y")
        request_body = json.loads(event['body'])
        course_id = request_body['courseId'] if 'courseId' in request_body else None
        student_id = request_body['studentId'] if 'studentId' in request_body else None
        available_date = request_body['availableDate'] if 'availableDate' in request_body else None

        if available_date is None or course_id is None or student_id is None:
            return response_400("courseId, studentId or availableDate is missing")
        # get count of reports for this student
        response = table.query(
            KeyConditionExpression="PK = :PK AND begins_with(SK, :SK)",
            ExpressionAttributeValues={
                ":PK": f"Course#{course_id}",
                ":SK": f"Student#{request_body['studentId']}Report#"
            })
        
        reportNum = str(response['Count']+1)
        report_id = reportNum + "-" + year

        # VALIDATION
        # checks that courseId passed in is not an empty string
        if not id_exists("Course", "Course", course_id):
            return response_404("courseId does not exist in database")

        # check if <studentId> has been registered with <courseId>]
        if not combination_id_exists("Course", course_id, "Student", student_id):
            return response_404("studentId is not registered with the course. To do so, please use /user/course to register")

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
                "Title": '',
                'AvailableDate': available_date,
                'UpdatedDate': '',
                "GoalsForNewTerm": '',
                "AdditionalComments": '',
            }
        response = table.put_item(Item=item)

        return response_200_msg_items("inserted", item)

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
