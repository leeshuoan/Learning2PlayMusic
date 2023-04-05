import boto3

USERPOOLID = "ap-southeast-1_WMzch8no8"
client = boto3.client("cognito-idp")

##########################################################
### (USER POOL) GET NAME, ID ON ALL USERS FROM A GROUP ###
##########################################################


def get_users(group):
    user_group_map = {
        "Users": {"id": "studentId", "name": "studentName"},
        "Teachers": {"id": "teacherId", "name": "teacherName"},
        "Admins": {"id": "adminId", "name": "adminName"},
        "SuperAdmins": {"id": "adminId", "name": "adminName"}
    }
    
    group_info = user_group_map[group]
    userIdString = group_info["id"]
    userNameString = group_info["name"]

    all_users_info = []
    response_iterator = client.get_paginator("list_users_in_group").paginate(
        UserPoolId=USERPOOLID, GroupName=group
    )

    for page in response_iterator:
        users_response = page["Users"]
        all_users_info.extend(
            {
                f"{userIdString}": user["Username"],
                f"{userNameString}": next(
                    (attr["Value"] for attr in user["Attributes"] if attr["Name"] == "custom:name"),
                    None
                )
            }
            for user in users_response
        )

    return all_users_info



#################################
### (USER POOL) GET ALL USERS ###
#################################


def get_all_users():

    all_users_info = []
    admins = get_users("Admins")
    students = get_users("Users")
    teachers = get_users("Teachers")
    superadmins = get_users("SuperAdmins")

    [all_users_info.append(admin) for admin in admins]
    [all_users_info.append(student) for student in students]
    [all_users_info.append(teacher) for teacher in teachers]
    [all_users_info.append(superadmin) for superadmin in superadmins]

    return all_users_info


#############################################
### (USER POOL) GET ONE USER FROM A GROUP ###
#############################################


def get_user(userId):

    all_users = get_all_users()

    for user in all_users:
        if userId in user.values():
            return user
