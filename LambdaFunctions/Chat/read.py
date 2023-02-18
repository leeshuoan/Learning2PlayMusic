import boto3
import json

""" this function will get read all the messages of a conversation with the conversation id being 
teacherId (always in front) + studentId
eg. 
student = abc
teacher =  123
conversationId = abc+123
"""
def lambda_handler(event, context):
    dynamodb = boto3.resource('dynamodb')
    table = dynamodb.Table('Chat')
    
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


"""
sample response
{
    "statusCode": 200,
    "body": [
        {
            "conversationId": "8cf0cd07-b89c-4140-88f0-327dbe720754+e67a3c45-e06e-4ca6-b57a-e149947b0223",
            "messageBody": "hello from student",
            "timestamp": "2023-02-09T04:33:23",
            "author": "e67a3c45-e06e-4ca6-b57a-e149947b0223"
        },
        {
            "conversationId": "8cf0cd07-b89c-4140-88f0-327dbe720754+e67a3c45-e06e-4ca6-b57a-e149947b0223",
            "messageBody": "hello from teacher",
            "timestamp": "2023-02-09T04:35:26",
            "author": "8cf0cd07-b89c-4140-88f0-327dbe720754"
        }
    ]
}
"""