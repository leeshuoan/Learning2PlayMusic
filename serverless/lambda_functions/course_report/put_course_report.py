import boto3

from global_functions.responses import *
from datetime import datetime
import dateutil.tz


def lambda_handler(event, context):

    dynamodb = boto3.resource('dynamodb')
    table_name = "LMS"
    table = dynamodb.Table(table_name)
    sg_timezone = dateutil.tz.gettz('Asia/Singapore')
    date = datetime.now(tz=sg_timezone).strftime("%Y-%m-%dT%H:%M:%S")

    try:
        request_body = json.loads(event['body'])

        # check that evaluation_list is present in the request body
        if 'evaluationList' not in request_body:
            return response_400("evaluationList is missing from request body")
        
        # check that title is present in the request body
        if 'title' not in request_body:
            return response_400("title is missing from request body")

        # check that availableDate is present in the request body
        if 'availableDate' not in request_body:
            return response_400("availableDate is missing from request body")
        
        if 'additionalComments' not in request_body:
            return response_400("additionalComments is missing from request body")
        
        if 'goalsForNewTerm' not in request_body:
            return response_400("goalsForNewTerm is missing from request body")

        # check that all evaluation metrics are present in the evaluation_list
        valid_metrics = set(['posture', 'rhythm', 'toneQuality', 'dynamicsControl', 'articulation', 'sightReading', 'practice',
                                          'theory', 'scales', 'aural', 'musicality', 'performing', 'enthusiasm', 'punctuality', 'attendance'])
        metrics_set = set(request_body['evaluationList'].keys())
        if not valid_metrics.issubset(metrics_set):
            return response_400("evaluationList is missing one or more evaluation metrics")

        course_id = request_body['courseId']
        report_id = request_body['reportId']
        student_id = request_body['studentId']
        evaluation_list = request_body['evaluationList']
        title = request_body['title']
        available_date = request_body['availableDate']
        updated_date = date
        additional_comments = request_body['additionalComments']
        goals_for_new_term = request_body['goalsForNewTerm']

        key = {
            "PK": f"Course#{course_id}",
            "SK": f"Student#{student_id}Report#{report_id}"
        }
        update_expression = 'SET EvaluationList = :evaluationList, Title = :title, AvailableDate = :availableDate, UpdatedDate= :updatedDate, AdditionalComments= :additionalComments, GoalsForNewTerm= :goalsForNewTerm'
        expression_attribute_values = {
            ':evaluationList': evaluation_list,
            ':title': title,
            ':availableDate': available_date,
            ':updatedDate': updated_date,
            ':additionalComments': additional_comments,
            ':goalsForNewTerm': goals_for_new_term
        }

        table.update_item(
            Key=key,
            UpdateExpression=update_expression,
            ExpressionAttributeValues=expression_attribute_values
        )

        return response_202_msg(f"Report with id {report_id} successfully updated ")

    except Exception as e:
        return response_400(str(e))
