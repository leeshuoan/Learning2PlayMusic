import boto3

def get_presigned_url(item, to_find):
    if to_find in item:
        s3_client = boto3.client('s3')
        bucket_name = item[to_find].split("/")[0]
        object_name = '/'.join(item[to_find].split("/")[1:])
        response = s3_client.generate_presigned_url('get_object',
                                                Params={'Bucket': bucket_name,
                                                        'Key': object_name},
                                                ExpiresIn=3600000)
        item[to_find] = response