import os
import boto3
from botocore.exceptions import ClientError

def publish_general_announcement(email_subject, email_content):

    client = boto3.client('ses')

    subject = email_subject
    body_text = email_content
    # body_html = '<p>Hello from <b>Amazon SES!</b></p>'
    EMAIL_SENDER = os.environ['SES_SENDER_EMAIL']
    EMAIL_RECEIVER = os.environ['SES_RECEIVER_EMAIL']

    try:
        response = client.send_email(
            Destination={
                'ToAddresses': [
                    EMAIL_RECEIVER
                ]
            },
            Message={
                'Body': {
                    # 'Html': {
                    #     'Charset': 'UTF-8',
                    #     'Data': body_html
                    # },
                    'Text': {
                        'Charset': 'UTF-8',
                        'Data': body_text
                    }
                },
                'Subject': {
                    'Charset': 'UTF-8',
                    'Data': subject
                }
            },
            Source=EMAIL_SENDER
        )
        print("Email sent! Message ID:"),
        print(response['MessageId'])

    except ClientError as e:
        print("Email not sent. Error message:"),
        print(e.response['Error']['Message'])
