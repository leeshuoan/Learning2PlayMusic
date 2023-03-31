import json
import boto3

from serverless.lambda_functions.global_functions.responses import response_200_msg, response_400

dynamodb = boto3.resource('dynamodb')
table_name = "LMS"
table = dynamodb.Table(table_name)

def lambda_handler(event, context) :
    try:
        request_body = json.loads(event['body'])

        course_id = request_body["courseId"]
        homework_id = request_body["homeworkId"]
        student_id = request_body["studentId"]
        homework_score = request_body["homeworkScore"]
        teacher_comments = request_body["teacherComments"]

        key = {
            'PK': f'Course#{course_id}',
            'SK': f'Student#{student_id}Homework#{homework_id}',
        }

        table.update_item(
            Key = key,
            UpdateExpression= f"SET Marked = :marked, HomeworkScore = :homeworkScore, TeacherComments = :teacherComments",
            ExpressionAttributeValues = {
                ":marked": True,
                ":homeworkScore": homework_score,
                ":teacherComments": teacher_comments
            }
        )
        
        return response_200_msg(f"Homework {homework_id} for student {student_id} marked!")

    except Exception as e:
        return response_400(str(e))