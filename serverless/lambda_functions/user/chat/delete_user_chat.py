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

        dynamodb = boto3.resource("dynamodb")
        table = dynamodb.Table("Chat")
        short_uuid = str(uuid.uuid4().hex)[:8]

        # check if firstUserId exists in Cognito
        if not get_user(firstUserId):
            return response_404('firstUserId does not exist in Cognito')
        
        # check if secondUserId exists in Cognito
        if not get_user(secondUserId):
            return response_404('secondUserId does not exist in Cognito')
        
        # VALIDATION: check that two same userIds are not passed in
        if firstUserId == secondUserId:
            return response_400("The same user cannot initiate a conversation with him/herself")

        # 1. Determine user type (student/teacher/admin)
        # get user's id-name key-pair value
        firstUser = get_user(firstUserId)
        secondUser = get_user(secondUserId)

        # FE sends in Student-Teacher/ Teacher-Student
        if 'studentId' in firstUser and 'teacherId' in secondUser:
            primarykey = f"Student#{firstUserId}"
            sortkey = f"Teacher#{secondUserId}"

        elif 'teacherId' in firstUser and 'studentId' in secondUser:
            primarykey = f"Student#{secondUserId}"
            sortkey = f"Teacher#{firstUserId}"

        # FE sends in Student-Admin/ Admin-Student
        elif 'studentId' in firstUser and 'adminId' in secondUser:
            hasAdmin = True
            primarykey = f"Admin#{secondUserId}"
            sortkey = f"Student#{firstUserId}"

        elif 'adminId' in firstUser and 'studentId' in secondUser:
            hasAdmin = True
            primarykey = f"Admin#{firstUserId}"
            sortkey = f"Student#{secondUserId}"

        # FE sends in Teacher-Admin/ Admin-Teacher
        elif 'teacherId' in firstUser and 'adminId' in secondUser:
            hasAdmin = True
            primarykey = f"Admin#{secondUserId}"
            sortkey = f"Teacher#{firstUserId}"

        elif 'adminId' in firstUser and 'teacherId' in secondUser:
            hasAdmin = True
            primarykey = f"Admin#{firstUserId}"
            sortkey = f"Teacher#{secondUserId}"

        # 2. check if convo exists for these 2 users
        if not hasAdmin:
          response = table.get_item(
              Key={
                "PK": primarykey,
                "SK": sortkey
              })
          if 'Item' not in response:
              return response_202_msg("Nothing to delete. This 2 users have no history of conversation.")

          # 3. if found existing convo between the 2 users
          table.delete_item(
            Key= {
                "PK": primarykey,
                "SK": sortkey
            })

        if hasAdmin:
          response = table.query(
              IndexName="SK-PK-index",
              KeyConditionExpression="SK = :SK AND PK = :PK",
              ExpressionAttributeValues={
                  ":SK": primarykey,
                  ":PK": sortkey
              })
          if 'Item' not in response:
              return response_202_msg("Nothing to delete. This 2 users have no history of conversation.")

          # 3. if found existing convo between the 2 users
          table.delete_item(
            Key= {
                "PK": sortkey,
                "SK": primarykey
            })

        return response_200_msg("deleted")

    except UnboundLocalError as e:
        print("❗Error: ", e)
        return response_400("Students cannot talk to each other (same for admins and teachers). But if you did not send in 2 studentIds/adminIds/teacherIds, there is an error. Check with BE.")

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
