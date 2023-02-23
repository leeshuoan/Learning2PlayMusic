import boto3


# checks if an id exists in database for primary keys following this format:
# (Course,Course#1) or (User, Student#1) or (GeneralAnnouncements, Date#2023-12-31) etc.
def id_exists(pk_name, sk_name, sk_id):
    dynamodb = boto3.resource("dynamodb")
    table = dynamodb.Table("LMS")

    response = table.query(
        KeyConditionExpression="PK = :PK AND begins_with(SK, :SK)",
        ExpressionAttributeValues={
            ":PK": f"{pk_name}",
            ":SK": f"{sk_name}#{sk_id}"
        })

    if response['Count'] != 0:
        # e.g.
        # if it's (Course, Course#1), then it means this courseId exists in db
        # if it's (User, Student#1), then it means this studentId exists in db
        return True

    return False

# checks if a pk_id+sk_id combination exists in database for primary keys following this format:
# (Course#1,Material#1) or (Course#123,Announcement#2) etc.
def combination_id_exists(pk_name, pk_id, sk_name, sk_id):
    dynamodb = boto3.resource("dynamodb")
    table = dynamodb.Table("LMS")

    response = table.query(
        KeyConditionExpression="PK = :PK AND begins_with(SK, :SK)",
        ExpressionAttributeValues={
            ":PK": f"{pk_name}#{pk_id}",
            ":SK": f"{sk_name}#{sk_id}"
        })

    if response['Count'] != 0:
        # e.g.
        # if it's (Course#1, Material#1), then it means this courseId+materialId combination exists in db
        return True

    return False

# checks if a dateId exists in database
def date_id_exists(dateId):
    dynamodb = boto3.resource("dynamodb")
    table = dynamodb.Table("LMS")

    response = table.query(
        KeyConditionExpression="PK = :PK AND begins_with(SK, :SK)",
        ExpressionAttributeValues={
            ":PK": "GeneralAnnouncements",
            ":SK": f"Date#{dateId}"
        })

    if response['Count'] != 0:
        return True  # dateId already exists

    return False