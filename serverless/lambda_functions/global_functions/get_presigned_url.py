import boto3

def get_presigned_url(item):
    if "QuestionImage" in item:
        s3_client = boto3.client('s3')
        bucket_name = item["QuestionImage"].split("/")[0]
        object_name = '/'.join(item["QuestionImage"].split("/")[1:])
        response = s3_client.generate_presigned_url('get_object',
                                                Params={'Bucket': bucket_name,
                                                        'Key': object_name},
                                                ExpiresIn=3600)
        item["QuestionImage"] = response