import json
import boto3

dynamodb = boto3.client('dynamodb')

def lambda_handler(event, context):
    connection_id = event['requestContext']['connectionId']
    
    # Delete the connection ID from the Connections table in DynamoDB
    try:
        response = dynamodb.delete_item(
            TableName='connectionMapping',
            Key={
                'ConnectionId': {'S': connection_id}
            }
        )
    except Exception as e:
        print(e)
        return {'statusCode': 500, 'body': json.dumps({'message': 'Failed to disconnect'})}
    
    return {'statusCode': 200, 'body': json.dumps({'message': 'Disconnected'})}
