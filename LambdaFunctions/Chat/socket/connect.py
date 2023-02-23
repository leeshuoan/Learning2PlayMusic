import json
import boto3
import os
# once enter chat will call this function and getContacts? 
dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('connectionMappings')
# table = dynamodb.Table(os.environ["tableName"]) # connectionMappings

def lambda_handler(event, context):
    try:
        # Get the user ID and connection ID from the WebSocket event
        userId = event['requestContext']['authorizer']['userId']
        connection_id = event['requestContext']['connectionId']
        
        # Check if the user ID already exists in the connection mappings table
        response = table.get_item(Key={'userId': userId})
        item = response.get('Item')
        
        # If the user ID already exists, delete the existing mapping
        if item:
            existing_connection_id = item.get('connection_id')
            if existing_connection_id != connection_id:
                table.delete_item(Key={'userId': userId})
        
        # Store the new connection ID in the connection mappings table
        table.put_item(Item={'userId': userId, 'connection_id': connection_id})
        
        # Return a successful response
        return {
            'statusCode': 200,
            'body': json.dumps({'message': 'WebSocket connection initialized.'})
        }
    
    except Exception as e:
        # Return an error response if an exception occurs
        return {
            'statusCode': 500,
            'body': json.dumps({'message': str(e)})
        }
