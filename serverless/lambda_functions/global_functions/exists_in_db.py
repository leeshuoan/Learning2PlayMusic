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

# checks if userName exists in the database
# to prevent creation of the same user through POST method
# 2 users (e.g. 2 students) can have the SAME firstName and lastName BUT NOT the same userName
# 2 users (e.g. 1 student, 1 teacher) can have the SAME firstName, lastName and userName
def user_name_for_user_type_exists(userName, userType):
    dynamodb = boto3.resource("dynamodb")
    table = dynamodb.Table("LMS")

    response = table.query(
        KeyConditionExpression="PK = :PK AND begins_with(SK, :SK)",
        ExpressionAttributeValues={
            ":PK": f"{userName}", # e.g. aiwei00 OR angeline00
            ":SK": f"{userType}#" # e.g. Student# OR Admin#
        })

    if response['Count'] != 0:
        # e.g.
        # if it's (aiwei00, Student), then it means this user has already been created
        return True

    return False
