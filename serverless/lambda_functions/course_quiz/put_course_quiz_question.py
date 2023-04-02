import json
import boto3
import base64
import os
import urllib.request
from botocore.exceptions import ClientError

from global_functions.responses import *

dynamodb = boto3.client("dynamodb")
s3 = boto3.client("s3")
bucket_name = os.environ["QUESTION_IMAGE_BUCKET_NAME"]

def lambda_handler(event, context):
    try:
        request_body = json.loads(event["body"])
        course_id = request_body["courseId"]
        quiz_id = request_body["quizId"]
        question_option_type = request_body["questionOptionType"]
        question_text = request_body["question"]
        options = request_body["options"]
        answer = request_body["answer"]
        qn_number = request_body["qnNumber"]
        options_stats = {}
        for option in options:
            options_stats[option] = 0

        s3_params = None
        if "questionImage" in request_body and request_body["questionImage"] != "":
            url = request_body["questionImage"]
            response = urllib.request.urlopen(url)
            data = response.read()
            base64_data = base64.b64encode(data).decode("utf-8")
            file_extension = base64_data.split(";")[0].split("/")[1]
            base64_image = base64_data.replace("data:image/{0};base64,".format(file_extension), "")
            image_buffer = base64.b64decode(base64_image)
            s3_params = {
                "Bucket": bucket_name,
                "Key": "Course{0}/Quiz{1}/Question{2}.{3}".format(course_id, quiz_id, qn_number, file_extension),
                "Body": image_buffer,
                "ContentType": "image/{0}".format(file_extension)
            }
            s3.put_object(**s3_params)

        if answer not in options:
            raise ValueError("answer must be one of the options")

        item = {
            "PK": "Course#{0}".format(course_id),
            "SK": "Quiz#{0}Question#{1}".format(quiz_id, qn_number),
            "QuestionOptionType": question_option_type,
            "Question": question_text,
            "Options": options,
            "Answer": answer,
            "Attempts": 0,
            "Correct": 0,
            **options_stats
        }
        if s3_params is not None:
            item["QuestionImage"] = "{0}/{1}".format(s3_params["Bucket"], s3_params["Key"])

        dynamodb.put_item(TableName="LMS", Item=item)

        return response_200_items("Successfully updated {0} Question(s)!".format(qn_number))

    except Exception as e:
        return response_400(str(e))
