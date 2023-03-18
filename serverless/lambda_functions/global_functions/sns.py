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


def publish_announcement(email_subject, email_content):

    topicArn = os.environ['SNS_TOPIC_ARN']
    subscribers = list_subscribers(topicArn)

    subject = email_subject
    body_text = email_content
    # body_html = '<p>Hello from <b>Amazon SES!</b></p>'
    EMAIL_SENDER = 'g3fyp2023@gmail.com' # will never change, similar to admin@gmail.com

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
                Source=EMAIL_SENDER
            )
            print("Email sent! Message ID:"),
            print(response['MessageId'])

        except ClientError as e:
            print("Email not sent. Error message:"),
            print(e.response['Error']['Message'])
