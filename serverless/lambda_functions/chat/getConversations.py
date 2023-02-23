import json
import boto3
import os
from boto3.dynamodb.conditions import Key, Attr

dynamodb = boto3.resource('dynamodb')
table_name = os.environ.get('tableName', 'Conversations')
table = dynamodb.Table(table_name)



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
    
