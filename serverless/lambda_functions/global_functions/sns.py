import os
import boto3
from botocore.exceptions import ClientError

sns_client = boto3.client('sns')
ses_client = boto3.client('ses')

def list_subscribers(topicArn):

    response = sns_client.list_subscriptions_by_topic(
        TopicArn=topicArn
    )

    subscriptions = response['Subscriptions']
    subscribers = [sub['Endpoint'] for sub in subscriptions]
    print("list of subscribers: ", subscribers)

    return subscribers


def publish_general_announcement(subject, content):

    topicArn = os.environ['SNS_TOPIC_ARN']
    subscribers = list_subscribers(topicArn)

    subject = subject
    body_text = content
    # body_html = '<p>Hello from <b>Amazon SES!</b></p>'
    email_sender = 'l2pma.addmin@gmail.com' # will never change, similar to admin@gmail.com

    for subscriber in subscribers:
        try:
            response = ses_client.send_email(
                Destination={
                    'ToAddresses': [
                        subscriber
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
                Source=email_sender
            )
            print("Email sent! Message ID:"),
            print(response['MessageId'])

        except ClientError as e:
            print("Email not sent. Error message:"),
            print(e.response['Error']['Message'])

def publish_course_announcement(subject, content): #sender should be a teacher's email

    topicArn = os.environ['SNS_TOPIC_ARN']
    subscribers = list_subscribers(topicArn)

    subject = subject
    body_text = content
    # body_html = '<p>Hello from <b>Amazon SES!</b></p>'
    email_sender = 'teacher@gmail.com' # will never change, similar to admin@gmail.com

    for subscriber in subscribers:
        try:
            response = ses_client.send_email(
                Destination={
                    'ToAddresses': [
                        subscriber
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
                Source=email_sender
            )
            print("Email sent! Message ID:"),
            print(response['MessageId'])

        except ClientError as e:
            print("Email not sent. Error message:"),
            print(e.response['Error']['Message'])
