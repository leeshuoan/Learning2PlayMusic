import boto3
import json
import os

""" this function will get read all the messages of a conversation with the conversation id being 
teacherId (always in front) + studentId
eg. 
student = abc
teacher =  123
conversationId = abc+123
"""
def lambda_handler(event, context):
    dynamodb = boto3.resource('dynamodb')
    table_name = os.environ.get('tableName', 'Chat')
    table = dynamodb.Table(table_name)
    conversationId = event.get('conversationId')
    if not conversationId:
        return {
            'statusCode': 400,
            'body': "Bad request, check your input"
        }
    
    try:
        response = table.scan(
            FilterExpression=boto3.dynamodb.conditions.Attr("conversationId").eq(conversationId)
        )        
        res = response['Items']
    except Exception as e:
        return {
            'statusCode': 500,
            'body': "AWS resource error, contact admin"
        }
    
    return {
        'statusCode': 200,
        'body': res
    }
