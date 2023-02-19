import json
import boto3
import os
from boto3.dynamodb.conditions import Key, Attr

dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table(os.environ["tableName"]) # Conversations


def lambda_handler(event, context):
    try:
        user_id = event['queryStringParameters']['userId']
        user_type = event['queryStringParameters']['userType']
        conversations = []

        # Query for conversations using studentId or teacherId
        if user_type == "User":
            response = table.query(
                KeyConditionExpression=Key('studentId').eq(user_id)
            )
            for item in response['Items']:
                conversations.append({"conversationId": item['conversationId'], "teacherName": item['teacherName']})

        elif user_type == "Teacher":
            response = table.query(
                IndexName='teacherId-index',
                KeyConditionExpression=Key('teacherId').eq(user_id)
            )
            for item in response['Items']:
                conversations.append({"conversationId": item['conversationId'], "studentName": item['studentName']})

        else: # admin -> no chat
            return {
                'statusCode': 402,
                'body': "User not allowed to chat"
            }
        
        return {
            'statusCode': 200,
            'body': conversations
        }
        
    except Exception as e:
        return {
            'statusCode': 500,
            'body': str(e)
        }
    

# Sample response when userType = "Teacher", teacherId = "8cf0cd07-b89c-4140-88f0-327dbe720754"
# {
#   "statusCode": 200,
#   "body": [
#     {
#       "conversationId": "8cf0cd07-b89c-4140-88f0-327dbe720754+e67a3c45-e06e-4ca6-b57a-e149947b0223",
#       "teacherName": "TeacherName"
#     }
#   ]
# }