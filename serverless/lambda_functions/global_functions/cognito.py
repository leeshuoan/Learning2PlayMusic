import boto3

USERPOOLID = "ap-southeast-1_WMzch8no8"
client = boto3.client("cognito-idp")

##########################################################
### (USER POOL) GET NAME, ID ON ALL USERS FROM A GROUP ###
##########################################################


def get_users(group):

    if group == "Users":
        userIdString = "studentId"
        userNameString = "studentName"
    elif group == "Teachers":
        userIdString = "teacherId"
        userNameString = "teacherName"
    elif group == "Admins":
        userIdString = "adminId"
        userNameString = "adminName"
        userType = "generalAdmin"
    elif group == "SuperAdmins":
        userIdString = "adminId"
        userNameString = "adminName"
        userType = "superAdmin"

    all_users_info = []
    users_response = client.list_users_in_group(UserPoolId=USERPOOLID, GroupName=group)[
        "Users"
    ]

    for user in users_response:

        for attribute in user["Attributes"]:
            if attribute["Name"] == "custom:name":
                userName = attribute["Value"]

                all_users_info.append(
                    {f"{userIdString}": user["Username"], f"{userNameString}": userName}
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
