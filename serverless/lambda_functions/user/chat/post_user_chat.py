import sys
import boto3
import json
import uuid

from global_functions.responses import *
from global_functions.exists_in_db import *
from global_functions.cognito import *

def lambda_handler(event, context):
    
    # DYDB MAPPING WILL ALWAYS BE AS FOLLOWS
    # Student#1 Teacher#1
    # Teacher#1 Admin#1
    # Student#1 Admin#1

    try:

        firstUserId = event['queryStringParameters']['firstUserId']
        secondUserId = event['queryStringParameters']['secondUserId']
        hasAdmin = False

        # check if firstUserId exists in Cognito
        if not get_user(firstUserId):
            return response_404('firstUserId does not exist in Cognito')
        
        # check if secondUserId exists in Cognito
        if not get_user(secondUserId):
            return response_404('secondUserId does not exist in Cognito')
        
        # 1. Determine user type (student/teacher/admin)
        # get user's id-name key-pair value
        firstUser = get_user(firstUserId)
        secondUser = get_user(secondUserId)

        # FE sends in Student-Teacher/ Teacher-Student
        if ('studentId' in firstUser and 'teacherId' in secondUser) or ('teacherId' in firstUser and 'studentId' in secondUser):
            primarykey = f"Student#{firstUserId}"
            sortkey = f"Teacher#{secondUserId}"

        # FE sends in Student-Admin/ Admin-Student
        if ('studentId' in firstUser and 'adminId' in secondUser) or ('adminId' in firstUser and 'studentId' in secondUser):
            hasAdmin=True
            primarykey = f"Student#{firstUserId}"
            sortkey = f"Admin#{secondUserId}"

        # FE sends in Teacher-Admin/ Admin-Teacher
        if ('teacherId' in firstUser and 'adminId' in secondUser) or ('adminId' in firstUser and 'teacherId' in secondUser):
            hasAdmin=True
            primarykey = f"Teacher#{firstUserId}"
            sortkey = f"Admin#{secondUserId}"

        dynamodb = boto3.resource("dynamodb")
        table = dynamodb.Table("Chat")
        short_uuid = str(uuid.uuid4().hex)[:8]

        # 2. check if convo exists for these 2 users
        if not hasAdmin:
          response = table.get_item(
              Key={
                "PK": primarykey,
                "SK": sortkey
              })
          if 'Item' in response:
              return response_202_msg("These 2 users already initiated a conversation")

        if hasAdmin:
          response = table.query(
              IndexName="SK-PK-index",
              KeyConditionExpression="SK = :SK AND PK, :PK",
              ExpressionAttributeValues={
                  ":SK": primarykey,
                  ":PK": sortkey
              })
          if 'Items' in response:
              return response_202_msg("These 2 users already initiated a conversation")

        # 3. if no existing convos between the 2 users -> initiate
        item = {
                "PK": primarykey,
                "SK": sortkey
            }
        response = table.put_item(Item=item)

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
