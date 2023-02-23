import json
import os
import boto3

""" this function will get all the contacts of the student or teacher based on the userInfo table """

def lambda_handler(event, context):
    dynamodb = boto3.resource('dynamodb')
    table_name = os.environ.get('tableName', 'UserInfo')
    table = dynamodb.Table(table_name)
    try:
        userId = event["queryStringParameters"]['userId']
    except KeyError:
        return {
            'statusCode': 400,
            'body': "Bad request, missing 'userId' parameter in the URL",
        }

    response = table.get_item(Key={"userId":userId})
    print(response)
    user = response['Item']
    contacts = []

    for contactId in user["contacts"]:
        contacts.append(table.get_item(Key={"userId": contactId})["Item"] )

    return {
        'statusCode': 200,
        'contacts': contacts
    }
    

