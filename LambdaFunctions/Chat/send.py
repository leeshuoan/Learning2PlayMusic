import boto3
import datetime
""" this function will get send a the message from the text box of a chat UI with the conversation id being 
teacherId (always in front) + studentId
eg. 
student = abc
teacher =  123
convId = abc+123
"""

def lambda_handler(event, context):
    try:
        dynamodb = boto3.client('dynamodb')
        
        conversationId = event.get('conversationId')
        author = event.get('author')
        messageBody = event.get('messageBody')
        
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
                'messageBody': {'S': messageBody}
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