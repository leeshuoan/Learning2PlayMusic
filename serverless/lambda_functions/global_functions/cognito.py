import boto3


##########################################################
### (USER POOL) GET ALL INFO ON ALL USERS FROM A GROUP ### -- NOT INVOKED OUTSIDE
##########################################################

# Existing groups: 'Admins', 'Teachers', 'Users'

def get_users_from_group(groupName):
    client = boto3.client('cognito-idp')
    
    response = client.list_users_in_group(
                UserPoolId='ap-southeast-1_WMzch8no8',
                GroupName=groupName
                )
    return response['Users']
    

##########################################################
### (USER POOL) GET NAME, ID ON ALL USERS FROM A GROUP ###
##########################################################

def get_users(group):
    
    if group == 'Users':
        userIdString = 'studentId'
        userNameString = 'studentName'
    if group == 'Teachers':
        userIdString = 'teacherId'
        userNameString = 'teacherName'
    if group == 'Admins':
        userIdString = 'adminId'
        userNameString = 'adminName'
        userType = 'generalAdmin'


    all_users_info = []
    users_response = get_users_from_group(group)
    
    for user in users_response:

        for attribute in user['Attributes']:
            if attribute['Name'] == 'custom:name':
                userName = attribute['Value']
                
                print(all_users_info)
        
                all_users_info.append({
                    f"{userIdString}": user['Username'],
                    f"{userNameString}": userName
                })
    
    return all_users_info

#############################################
### (USER POOL) GET ONE USER FROM A GROUP ###
#############################################

def get_user(group,userId):

    if group == 'Users':
        userIdString = 'studentId'
        userNameString = 'studentName'
    if group == 'Teachers':
        userIdString = 'teacherId'
        userNameString = 'teacherName'
    if group == 'Admins':
        userIdString = 'adminId'
        userNameString = 'adminName'
        userType = 'generalAdmin'


    user_info = []
    users = get_users(group)

    [user_info.append(user) for user in users if user[userIdString]==userId]

    return user_info


#####################################
### (IDENTITY POOL) GET ALL USERS ### -- NOT INVOKED OUTSIDE
#####################################

class CognitoIdentityProviderWrapper:
    """Encapsulates Amazon Cognito actions"""
    def __init__(self, cognito_idp_client, user_pool_id, client_id, client_secret=None):
        """
        :param cognito_idp_client: A Boto3 Amazon Cognito Identity Provider client.
        :param user_pool_id: The ID of an existing Amazon Cognito user pool.
        :param client_id: The ID of a client application registered with the user pool.
        :param client_secret: The client secret, if the client has a secret.
        """
        self.cognito_idp_client = cognito_idp_client
        self.user_pool_id = user_pool_id
        self.client_id = client_id
        self.client_secret = client_secret

    def list_users(self):
        """
        Returns a list of the users in the current user pool.

        :return: The list of users.
        """
        try:
            response = self.cognito_idp_client.list_users(UserPoolId=self.user_pool_id)
            users = response['Users']
        except ClientError as err:
            logger.error(
                "Couldn't list users for %s. Here's why: %s: %s", self.user_pool_id,
                err.response['Error']['Code'], err.response['Error']['Message'])
            raise
        else:
            return users
            
def get_all_idp_users():
    client = boto3.client('cognito-idp')
    init_cognito = CognitoIdentityProviderWrapper(client, "ap-southeast-1_WMzch8no8", "3tgu8hlll0bvman0pa366c1o10")
    response = init_cognito.list_users()
    
    return response