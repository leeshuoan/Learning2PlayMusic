import sys
import boto3
import json

from global_functions.responses import *
from global_functions.exists_in_db import *
from global_functions.cognito import *

def lambda_handler(event, context):

    # DYDB MAPPING WILL ALWAYS BE AS FOLLOWS
    # Student#1 Teacher#1
    # Teacher#1 Admin#1
    # Student#1 Admin#1

    try:

        userId = event['queryStringParameters']['userId']

        # check if userId exists in Cognito
        user = get_user(userId)
        if not user:
            return response_404('userId does not exist in Cognito')

        dynamodb = boto3.resource("dynamodb")
        table = dynamodb.Table("Chat")

        # if FE passes in studentId
        if 'studentId' in user:
          response = table.query(
              KeyConditionExpression="PK = :PK",
              ExpressionAttributeValues={
                  ":PK": f"Student#{userId}",
              })
          items = response["Items"]
          print(items)
          print(get_user(userId))

        # if FE passes in teacherId
        if 'teacherId' in user:
          response0 = table.query(
              KeyConditionExpression="PK = :PK",
              ExpressionAttributeValues={
                  ":PK": f"Teacher#{userId}",
              })
          items0 = response0["Items"]

          response = table.query(
              IndexName="SK-PK-index",
              KeyConditionExpression="SK = :SK",
              ExpressionAttributeValues={
                  ":SK": f"Teacher#{userId}"
              })
          items = response["Items"]

          [items.append(item) for item in items0]

        # if FE passes in adminId
        if 'adminId' in user:
          response = table.query(
              IndexName="SK-PK-index",
              KeyConditionExpression="SK = :SK",
              ExpressionAttributeValues={
                  ":SK": f"Admin#{userId}"
              })
          items = response["Items"]

        # {'studentId': '81c2ca2f-6a04-4e79-a41c-97aa85cf9edb', 'studentName': 'James'}

        for item in items:
            if userId in item['PK']:
              receiverId = item['SK'].split("#")[1]
            elif userId in item['SK']:
              receiverId = item['PK'].split("#")[1]

            receiver = get_user(receiverId)
            if 'adminId' in receiver:
                receiverName = receiver['adminName']
            elif 'teacherId' in receiver:
                receiverName = receiver['teacherName']
            elif 'studentId' in receiver:
                receiverName = receiver['studentName']
            item['receiverId'] = receiverId
            item['receiverName'] = receiverName

        return response_200_items(items)


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
