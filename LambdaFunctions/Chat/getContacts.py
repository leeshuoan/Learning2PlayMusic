import json
import boto3

""" this function will get all the contacts of the student or teacher based on the userInfo table """

def lambda_handler(event, context):
    dynamodb = boto3.resource('dynamodb')
    table = dynamodb.Table('UserInfoTable')
    try:
        UserName = event['user_name']
    except KeyError:
        return {
            'statusCode': 400,
            'body': "Bad request, missing 'user_name' parameter in the URL",
        }
    try:
        response = table.get_item(Key={"UserName":UserName})
        user = response['Item']
        contacts = []
        if user["UserRole"] == "Teacher":
            
        elif user["UserRole"] == "User":
            for teacherId in user["teachers"]:
                contacts.append(table.get_item(Key={"UserName": teacherId})["Item"] )

    except Exception as e:
        return {
            'statusCode': 500,
            'body': "AWS resource error, contact admin"
        }    
    return {
        'statusCode': 200,
        'body': contacts
    }
    

