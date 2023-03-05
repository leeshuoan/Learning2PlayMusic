import boto3
import json
import uuid

dynamodb = boto3.client('dynamodb')
dynamodb_resource = boto3.resource('dynamodb')
table_name = "LMS"

       
def lambda_handler(event, context):
    try:
        request_body = json.loads(event['body'])
        course_id = request_body['courseId']
        student_id = request_body['studentId']
        quiz_id = request_body['quizId']
        quiz_score = request_body['quizScore']

        key = {
            "PK": f"Course#{course_id}",
            "SK": f"Student#{student_id}Quiz#{quiz_id}"
        }

        get_attempts_response = dynamodb.get_item(
            TableName=table_name,
            Key=key,
            ProjectionExpression="QuizAttempt, QuizMaxAttempt"
        )

        attempts = get_attempts_response['Item']
        if attempts['QuizAttempt'] >= attempts['QuizMaxAttempt']:
            raise ValueError(f"Already attempted max number of times: {attempts['QuizAttempt']}")

        update_expression = "set QuizScore = :newQuizScore, QuizAttempt = QuizAttempt + :val"
        expression_attribute_values = {
            ":newQuizScore": {"N": str(quiz_score)},
            ":val": {"N": str(1)}
        }

        update_params = {
            "TableName": table_name,
            "Key": key,
            "UpdateExpression": update_expression,
            "ExpressionAttributeValues": expression_attribute_values
        }

        after_update_response = dynamodb.update_item(**update_params)

        return {
            "statusCode": 200,
            "body": json.dumps({"message": f"Quiz {quiz_id} successfully submitted"})
        }

    except Exception as e:
        return {
            "statusCode": 400,
            "body": json.dumps({"error": str(e)})
        }