import base64
import json
import os
import sys

import boto3
from global_functions.exists_in_db import *
from global_functions.responses import *

dynamodb = boto3.resource('dynamodb')
table_name = "LMS"
table = dynamodb.Table(table_name)
bucket_name = os.environ['MATERIAL_ATTACHMENT_BUCKET_NAME']
s3 = boto3.client('s3')

def lambda_handler(event, context):

    try:
        dynamodb = boto3.resource("dynamodb")
        table = dynamodb.Table("LMS")

        request_body = json.loads(event['body'])
        course_id = request_body['courseId']
        material_id = request_body['materialId']
        material_title = request_body['materialTitle']
        material_lesson_date = request_body['materialLessonDate']
        material_link = request_body['materialLink']
        material_type = request_body['materialType']
        material_attachment_file_name = request_body['materialAttachmentFileName']


        if not course_id or not material_id:
            return response_400("courseId or materialId is missing")

        if not id_exists("Course", "Course", course_id):
            return response_404("courseId does not exist in database")

        if not combination_id_exists("Course", course_id, "Material", material_id):
            return response_404("materialId does not exist in database")
        
        if (len(request_body) == 4):
            response = table.update_item(
                Key={
                    "PK": f"Course#{course_id}",
                    "SK": f"Material#{material_id}",
                },
                UpdateExpression="set MaterialTitle = :t, MaterialLessonDate = :d",
                ExpressionAttributeValues={
                    ":t": material_title,
                    ":d": material_lesson_date,
                },
            )
        else:
            material_attachment = ""
            if request_body['materialAttachment'] != "":
                base64data = request_body['materialAttachment']
                material_attachment= handle_attachment(base64data, course_id, material_id, material_attachment_file_name)

            item = {
                "PK": f"Course#{course_id}",
                "SK": f"Material#{material_id}",
                "MaterialLessonDate": material_lesson_date,
                "MaterialLink": material_link,
                "MaterialAttachment": material_attachment,
                "MaterialTitle": material_title,
                "MaterialType": material_type,
                "MaterialAttachmentFileName": material_attachment_file_name
            }

            response = table.put_item(Item= item)


        return response_200_msg_items("updated", item)

    # currently, this is only for functions that sends in request body - to catch 'missing fields' error
    except KeyError:
        print("❗Exception Type Caught - KeyError")
        return response_500("One or more field(s) is missing. Please double check that all fields in the model schema are populated.")

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
    
def handle_attachment(base64data:str, course_id:str, material_id:str, material_title:str):
        # Extract the file extension and decode the base64 data
    file_extension = base64data.split(';')[0].split('/')[1]
    base64_value = base64data.split(',')[1]
    homework_attachment = base64.b64decode(base64_value)

    # Upload the image data to S3
    s3key = f'Course{course_id}/{material_title}_{material_id}.{file_extension}'
    if file_extension == "pdf":
        content_type = "application/pdf"
    elif file_extension == "png" or file_extension == "jpg" or file_extension == "jpeg":
        content_type = f'image/{file_extension}'
    else:
        raise Exception("Attachment must a .pdf, .png, .jpg or .jpeg file")

    s3_params = {
        'Bucket': bucket_name,
        'Key': s3key,
        'Body': homework_attachment,
        'ContentType': content_type,
        'ContentDisposition': "inline"
    }
    s3.put_object(**s3_params)
    
    material_attachment = bucket_name + "/" + s3key

    return material_attachment