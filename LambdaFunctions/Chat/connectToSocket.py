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
        user_id = event['requestContext']['authorizer']['user_id']
        connection_id = event['requestContext']['connectionId']
        
        # Check if the user ID already exists in the connection mappings table
        response = table.get_item(Key={'user_id': user_id})
        item = response.get('Item')
        
        # If the user ID already exists, delete the existing mapping
        if item:
            existing_connection_id = item.get('connection_id')
            if existing_connection_id != connection_id:
                table.delete_item(Key={'user_id': user_id})
        
        # Store the new connection ID in the connection mappings table
        table.put_item(Item={'user_id': user_id, 'connection_id': connection_id})
        
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
