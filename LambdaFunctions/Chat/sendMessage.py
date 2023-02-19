import boto3
import datetime
import json

def lambda_handler(event, context):
    try:
        dynamodb = boto3.client('dynamodb')
        
        conversationId = event.get('conversationId')
        author = event.get('author')
        messageBody = event.get('messageBody')
        users = conversationId.split("+")
        if users[0]== author:
            recipient = users[1]
        else:
            recipient = users[0]
        
        # Validate input parameters
        if not conversationId:
            return {
                'statusCode': 400,
                'body': "Bad request, conversationId is required"
            }
        if not author:
            return {
                'statusCode': 400,
                'body': "Bad request, author is required"
            }
        if not messageBody:
            return {
                'statusCode': 400,
                'body': "Bad request, messageBody is required"
            }
        
        # Generate unique timestamp
        timestamp = str(datetime.datetime.now().isoformat())
        
        # Insert the new message into DynamoDB
        response = dynamodb.put_item(
            TableName='Chat',
            Item={
                'conversationId': {'S': conversationId},
                'timestamp': {'S': timestamp},
                'author': {'S': author},
                'messageBody': {'S': messageBody},
                'recipient': {'S': recipient}
            }
        )
        
        # Return success response
        return {
            'statusCode': 200,
            'body': "Message sent successfully"
        }
    except Exception as e:
        return {
            'statusCode': 500,
            'body': "Error sending message: " + str(e)
        }
