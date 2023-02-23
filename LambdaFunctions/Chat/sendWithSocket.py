import json
import boto3
import datetime
from boto3.dynamodb.conditions import Key, Attr

dynamodb = boto3.client('dynamodb')
apigatewaymanagementapi = boto3.client('apigatewaymanagementapi')

def lambda_handler(event, context):
    connection_id = event['requestContext']['connectionId']
    body = json.loads(event['body'])
    
    conversation_id = body.get('conversationId')
    author = body.get('author')
    message_body = body.get('messageBody')

    users = conversation_id.split("+")
    if users[0]== author:
        recipient = users[1]
    else:
        recipient = users[0]
        
    if not conversation_id or not author or not message_body:
        return {
            'statusCode': 400,
            'body': 'Bad request, conversationId, author, and messageBody are required'
        }
    
    timestamp = str(datetime.datetime.now().isoformat())

    try:
        response = dynamodb.put_item(
            TableName='Chat',
            Item={
                'conversationId': {'S': conversation_id},
                'timestamp': {'S': timestamp},
                'author': {'S': author},
                'messageBody': {'S': message_body},
                'recipient': {'S': recipient}
            }
        )
    except Exception as e:
        print(e)
        return {
            'statusCode': 500,
            'body': 'Error saving message to database'
        }
    
    try:
        # Get all active connections for the recipient
        connections_response = dynamodb.query(
            TableName='connectionMappings',
            KeyConditionExpression=Key('userId').eq(author),
        )
        connections = connections_response['Items']
        
        # Send message to recipient's connections
        for connection in connections:
            recipient_connection_id = connection['connectionId']['S']
            if recipient_connection_id != connection_id:
                apigatewaymanagementapi.post_to_connection(
                    Data=json.dumps({
                        'conversationId': conversation_id,
                        'timestamp': timestamp,
                        'author': author,
                        'messageBody': message_body,
                        'recipient': recipient
                    }),
                    ConnectionId=recipient_connection_id
                )
    except Exception as e:
        print(e)
        return {
            'statusCode': 500,
            'body': 'Error sending message to recipient'
        }
    
    return {
        'statusCode': 200,
        'body': 'Message sent successfully'
    }
