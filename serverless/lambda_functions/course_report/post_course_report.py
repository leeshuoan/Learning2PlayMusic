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

        sgTimezone = dateutil.tz.gettz('Asia/Singapore')
        year = datetime.now(tz=sgTimezone).strftime("%Y")

        # get count of reports for this student
        response = table.query(
            KeyConditionExpression="PK = :PK AND begins_with(SK, :SK)",
            ExpressionAttributeValues={
                ":PK": f"Course#{json.loads(event['body'])['courseId']}",
                ":SK": f"Student#{json.loads(event['body'])['studentId']}Report#"
            })
        
        reportNum = str(response['Count']+1)

        reportId = reportNum + "-" + year
        
        

        # VALIDATION
        # checks that courseId passed in is not an empty string
        if json.loads(event['body'])['courseId']=="":
            return response_400("courseId is missing")

        # check if <courseId> exists in database
        courseId = json.loads(event['body'])['courseId']
        if not id_exists("Course", "Course", courseId):
            return response_404("courseId does not exist in database")

        # check if <studentId> exists in database
        studentId = json.loads(event['body'])['studentId']
        if not combination_id_exists("Course", courseId, "Student", studentId):
            return response_404("studentId is not registered with the course. To do so, please use /user/student/course to register")

        # check that evaluation_list is present in the request body
        if 'evaluationList' not in json.loads(event['body']):
            return response_400("evaluationList is missing from request body")
        
        # check that title is present in the request body
        if 'title' not in json.loads(event['body']):
            return response_400("title is missing from request body")
        
        # check that dateAvailable is present in the request body
        if 'dateAvailable' not in json.loads(event['body']):
            return response_400("dateAvailable is missing from request body")

        # check that all evaluation metrics are present in the evaluation_list
        valid_metrics = set(['posture', 'rhythm', 'tone quality', 'dynamics control', 'articulation', 'sight-reading', 
                            'practice and lesson participation', 'theory', 'scales & arpeggios', 'aural skills', 
                            'musicality & artistry', 'performing', 'enthusiasm in music learning', 'punctuality', 'attendance'])
        metrics_set = set(json.loads(event['body'])['evaluationList'].keys())
        if not valid_metrics.issubset(metrics_set):
            return response_400("evaluationList is missing one or more evaluation metrics")

        item = {
                "PK": f"Course#{json.loads(event['body'])['courseId']}",
                "SK": f"Student#{json.loads(event['body'])['studentId']}Report#{reportId}",
                "EvaluationList": json.loads(event['body'])['evaluationList'],
                "Title": json.loads(event['body'])['title'],
                'Date Available': json.loads(event['body'])['dateAvailable'],
                "GoalsForNewTerm": json.loads(event['body'])['goalsForNewTerm'],
                "AdditionalComments": json.loads(event['body'])['additionalComments'],
            }
        response = table.put_item(Item=item)

        return response_200_msg_items("inserted", item)

    # currently, this is only for functions that sends in request body - to catch 'missing fields' error
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
