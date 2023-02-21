import json

# For POST, DELETE functions
def response_200(success_msg):
    return {
        "statusCode": 200,
        "headers": {
            "Access-Control-Allow-Headers": "Content-Type",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "POST,GET,DELETE"
        },
        "body": json.dumps({"message": f"[SUCCESS] {success_msg}"})
    }

# For most GET functions
def response_200_GET(items):
    return {
        "statusCode": 200,
        "headers": {
            "Access-Control-Allow-Headers": "Content-Type",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "POST,GET,DELETE"
        },
        "body": json.dumps(items)
    }

def response_400(error_msg):
    return {
        "statusCode": 400,
        "headers": {
            "Access-Control-Allow-Headers": "Content-Type",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "POST,GET,DELETE"
        },
        "body": json.dumps({"message": f"[ERROR] {error_msg}"})
    }

def response_500(error_msg):
    return {
        "statusCode": 500,
        "headers": {
            "Access-Control-Allow-Headers": "Content-Type",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "POST,GET,DELETE"
        },
        "body": json.dumps({"message": f"[ERROR] {error_msg}"})
    }