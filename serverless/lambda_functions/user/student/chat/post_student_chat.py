import sys
import boto3
import json
import uuid

from global_functions.responses import *
from global_functions.exists_in_db import *
from global_functions.cognito import *

def lambda_handler(event, context):

    try:

        studentId = event['queryStringParameters']['studentId']
        userId = event['queryStringParameters']['userId']

        # check if studentId exists in Cognito
        if not get_user(studentId):
            return response_404('studentId does not exist in Cognito')
        
        # check if userId exists in Cognito
        if not get_user(userId): # either teacher or admin
            return response_404('userId does not exist in Cognito')
        
        # get user
        user = get_user(userId)

        dynamodb = boto3.resource("dynamodb")
        table = dynamodb.Table("Chat")
        short_uuid = str(uuid.uuid4().hex)[:8]

        # if starting a chat with a teacher
        if 'teacherId' in user:
            primarykey = f"Teacher#{userId}"

        # check if existing teacher-student convo exists
        table_response = table.get_item(
                Key={
                    "PK": f"Teacher#{userId}",
                    "SK": f"Student#{studentId}"
                })
        table_items = table_response["Item"]

        table_index_response = table.query(
            IndexName="SK-PK-index",
            KeyConditionExpression="SK = :SK AND begins_with(PK, :PK)",
            ExpressionAttributeValues={
                ":SK": f"Teacher#{userId}",
                ":PK": f"Student#{studentId}"
            })

        table_index_items = table_index_response["Items"]

        for table_item in table_items:
            for table_index_item in table_index_items:
                if table_item != table_index_item:
                    table_item.append(table_index_item)

        print('table_item: ', table_item)

        # check if existing admin-student convo exists

        if 'adminId' in user:
            primarykey = f"Admin#{userId}"

        # item = {
        #         "PK": primarykey,
        #         "SK": f"Admin#{adminId}",
        #         "ChatId": short_uuid
        #     }
        # response = table.put_item(Item=item)

        return response_200_msg_items("inserted", item)

    except Exception as e:
        # print(f".......... 🚫 UNSUCCESSFUL: Failed request for Course ID: {courseId} 🚫 ..........")
        exception_type, exception_object, exception_traceback = sys.exc_info()
        filename = exception_traceback.tb_frame.f_code.co_filename
        line_number = exception_traceback.tb_lineno
        print("❗Exception type: ", exception_type)
        print("❗File name: ", filename)
        print("❗Line number: ", line_number)
        print("❗Error: ", e)

        return response_500(e)
