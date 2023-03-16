import boto3
from botocore.exceptions import ClientError

def publish_email():

    client = boto3.client('ses')

    subject = 'Test email'
    body_text = 'Hello from Amazon SES!'
    body_html = '<p>Hello from <b>Amazon SES!</b></p>'
    to_address = 'aiwei.testt@gmail.com'

    try:
        response = client.send_email(
            Destination={
                'ToAddresses': [
                    to_address
                ]
            },
            Message={
                'Body': {
                    'Html': {
                        'Charset': 'UTF-8',
                        'Data': body_html
                    },
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
            Source='sender@example.com'
        )
        print("Email sent! Message ID:"),
        print(response['MessageId'])

    except ClientError as e:
        print("Email not sent. Error message:"),
        print(e.response['Error']['Message'])
