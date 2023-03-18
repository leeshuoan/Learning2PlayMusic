import os
import boto3
from botocore.exceptions import ClientError

sns_client = boto3.client('sns')
ses_client = boto3.client('ses')

def list_subscribers(topicArn):

    response = sns_client.list_subscriptions_by_topic(
        TopicArn=topicArn
    )

    print("########### list of subscribers ###############")
    print(response)


def publish_announcement(email_subject, email_content):

    topicArn = os.environ['SNS_TOPIC_ARN']
    print("topic arn: ", topicArn)
    list_subscribers(topicArn)

    # subject = email_subject
    # body_text = email_content
    # # body_html = '<p>Hello from <b>Amazon SES!</b></p>'
    # EMAIL_SENDER = os.environ['SES_SENDER_EMAIL']
    # EMAIL_RECEIVER = os.environ['SES_RECEIVER_EMAIL']

    # try:
    #     response = ses_client.send_email(
    #         Destination={
    #             'ToAddresses': [
    #                 EMAIL_RECEIVER
    #             ]
    #         },
    #         Message={
    #             'Body': {
    #                 # 'Html': {
    #                 #     'Charset': 'UTF-8',
    #                 #     'Data': body_html
    #                 # },
    #                 'Text': {
    #                     'Charset': 'UTF-8',
    #                     'Data': body_text
    #                 }
    #             },
    #             'Subject': {
    #                 'Charset': 'UTF-8',
    #                 'Data': subject
    #             }
    #         },
    #         Source=EMAIL_SENDER
    #     )
    #     print("Email sent! Message ID:"),
    #     print(response['MessageId'])

    # except ClientError as e:
    #     print("Email not sent. Error message:"),
    #     print(e.response['Error']['Message'])
