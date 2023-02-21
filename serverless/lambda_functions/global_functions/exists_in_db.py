import boto3

# checks if a courseId exists in database
def course_id_exists(courseId):
    dynamodb = boto3.resource("dynamodb")
    table = dynamodb.Table("LMS")

    response = table.query(
        KeyConditionExpression="PK = :PK AND begins_with(SK, :SK)",
        ExpressionAttributeValues={
            ":PK": "Course",
            ":SK": f"Course#{courseId}"
        })

    if response['Count'] != 0:
        return True  # courseid already exists

    return False

# check if courseId+itemId combination exists in database
# e.g. Course#1Material#1, Course#123Announcement#2
def course_item_id_exists(courseId, itemName, itemId):
    dynamodb = boto3.resource("dynamodb")
    table = dynamodb.Table("LMS")

    response = table.query(
        KeyConditionExpression="PK = :PK AND begins_with(SK, :SK)",
        ExpressionAttributeValues={
            ":PK": f"Course#{courseId}",
            ":SK": f"{itemName}#{itemId}"
        })

    if response['Count'] != 0:
        return True  # courseId+itemId combination already exists

    return False