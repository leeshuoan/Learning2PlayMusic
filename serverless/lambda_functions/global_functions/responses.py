import json

##########################
######## Helper #########
##########################

class SetEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, set):
            return list(obj)
        return json.JSONEncoder.default(self, obj)

##########################
######## SUCCESS #########
##########################

# For GET functions
def response_200_items(items):
    return {
        "statusCode": 200,
        "headers": {
            "Access-Control-Allow-Headers": "Content-Type",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "POST,GET,DELETE,PUT"
        },
        "body": json.dumps(items, cls=SetEncoder)
    }

# For responses that accept but don't act upon
# E.g. see post_student_course.py for more info
def response_202_msg(success_msg):
    return {
        "statusCode": 202,
        "headers": {
            "Access-Control-Allow-Headers": "Content-Type",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "POST,GET,DELETE,PUT"
        },
        "body": json.dumps({"message": f"[SUCCESS] {success_msg}"})
    }

# For POST/PUT functions
# action = 'inserted' or 'deleted' or 'updated' etc.
# item = {
#     "Key1": "Value1",
#     "Key2": "Value2"
# }
def response_200_msg_items(action, item):
    return {
        "statusCode": 200,
        "headers": {
            "Access-Control-Allow-Headers": "Content-Type",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "POST,GET,DELETE,PUT"
        },
        "body": json.dumps({
                    "message": f"[SUCCESS] successfully {action} item",
                    "item": item
                    })
    }
def response_200_msg_double_items(action, item, action1, item1):
    return {
        "statusCode": 200,
        "headers": {
            "Access-Control-Allow-Headers": "Content-Type",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "POST,GET,DELETE,PUT"
        },
        "body": json.dumps({
                    "message": f"[SUCCESS] successfully {action} item",
                    "item": item,
                    "message": f"[SUCCESS] successfully {action1} item",
                    "item": item1,
                    })
    }
def response_202_msg_custom_items( customItem):
    return {
        "statusCode": 202,
        "headers": {
            "Access-Control-Allow-Headers": "Content-Type",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "POST,GET,DELETE,PUT"
        },
        "body": json.dumps(customItem)
    }

# For DELETE functions
def response_200_msg(success_msg):
    return {
        "statusCode": 200,
        "headers": {
            "Access-Control-Allow-Headers": "Content-Type",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "POST,GET,DELETE,PUT"
        },
        "body": json.dumps({
                    "message": f"[SUCCESS] {success_msg}"
                    })
    }

##########################
### CLIENT-SLIDE ERROR ###
##########################

# General catch-all for client-side error
def response_400(error_msg):
    return {
        "statusCode": 400,
        "headers": {
            "Access-Control-Allow-Headers": "Content-Type",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "POST,GET,DELETE,PUT"
        },
        "body": json.dumps({"message": f"[ERROR] {error_msg}"})
    }

# The id has been hard-deleted/ does not exist in the first place
# item_id_name = 'courseId', 'studentId' etc.
def response_404(error_msg):
    return {
        "statusCode": 404, # Not found
        "headers": {
            "Access-Control-Allow-Headers": "Content-Type",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "POST,GET,DELETE,PUT"
        },
        "body": json.dumps({"message": f"[ERROR] {error_msg}"})
    }

# The id has been soft-deleted
# item_id_name = 'courseId', 'studentId' etc.
def response_409(error_msg):
    return {
        "statusCode": 409, # Conflict
        "headers": {
            "Access-Control-Allow-Headers": "Content-Type",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "POST,GET,DELETE,PUT"
        },
        "body": json.dumps({"message": f"[ERROR] {error_msg}"})
    }


##########################
### SERVER-SLIDE ERROR ###
##########################

# General catch-all for server-side error
def response_500(error_msg):
    return {
        "statusCode": 500,
        "headers": {
            "Access-Control-Allow-Headers": "Content-Type",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "POST,GET,DELETE,PUT"
        },
        "body": json.dumps({"message": f"[ERROR] {error_msg}"})
    }

######################
### RANDOM PIKACHU ###
######################

def has_student_teacher_pairing(studentId, teacherId, table):

    # get all course taught by teacher
    response = table.query(
        KeyConditionExpression="PK= :PK AND begins_with(SK, :SK)",
        ExpressionAttributeValues={
            ":PK": f"Teacher#{teacherId}",
            ":SK": f"Course#"
        })
    items = response["Items"]

    # check if for each course the teacher teaches, whether the student is in the course
    for item in items:
        courseId = item['SK'].split("#")[1]

        student = table.get_item(
              Key={
                  "PK": f"Student#{studentId}",
                  "SK": f"Course#{courseId}"
              })

        if 'Item' in student:
            return True

    return False