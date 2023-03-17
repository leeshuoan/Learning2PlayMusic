import boto3

from aws_cdk import (
    aws_lambda as _lambda,
    aws_apigateway as apigw,
    aws_ses as ses,
    aws_iam,
    Stack,
    Fn
)

from constructs import Construct


class AnnouncementStack(Stack):

    def __init__(self, scope: Construct, construct_id: str, **kwargs) -> None:
        super().__init__(scope, construct_id, **kwargs)

        #################
        ### CONSTANTS ###
        #################

        FUNCTIONS_FOLDER = "./lambda_functions/"
        GENERALANNOUNCEMENT_FUNCTIONS_FOLDER = "generalannouncement"


        ###########
        ### IAM ###
        ###########

        # Get existing iam role (lambda-general-role)
        iam = boto3.client("iam")
        role = iam.get_role(RoleName="lambda-general-role")
        role_arn = role["Role"]["Arn"]
        LAMBDA_ROLE = aws_iam.Role.from_role_arn(
            self, "lambda-general-role", role_arn)


        ###########
        ### SES ###
        ###########

        # EMAIL_SENDER = 'g3fyp2023@gmail.com'
        # EMAIL_RECEIVER = 'aiwei.testt@gmail.com'
        # EMAIL_RECEIVER = 'l2pma.student@gmail.com'

        # # Initialize an SES email sender and receiver
        # cfn_email_identity = ses.CfnEmailIdentity(self, f"{EMAIL_SENDER}-CfnEmailIdentity", email_identity=EMAIL_SENDER)
        # cfn_email_identity = ses.CfnEmailIdentity(self, f"{EMAIL_RECEIVER}-CfnEmailIdentity",email_identity=EMAIL_RECEIVER)

        # cfn_contact_list = ses.CfnContactList(self, "GeneralAnnouncementContactListCfnContactList",
        #     contact_list_name="GeneralAnnouncementContactList",
        #     description="Contains all identities that subscribed to General Announcements (Both senders and receivers)",
        #     # tags=[CfnTag(
        #     #     key="key",
        #     #     value="value"
        #     # )],
        #     topics=[ses.CfnContactList.TopicProperty(
        #         default_subscription_status="OPT_IN", # can opt for "NO_CONFIRMATION"
        #         display_name="L2PMAGeneralAnnouncement",
        #         topic_name="GeneralAnnouncementTopic",

        #         # the properties below are optional
        #         description="A topic created for general announcements"
        #     )]
        # )

        # print("cfn_contact_list")
        # print(cfn_contact_list)


        ########################
        ### LAMBDA FUNCTIONS ###
        ########################

        get_generalannouncement = _lambda.Function( self, "getGeneralAnnouncement", runtime=_lambda.Runtime.PYTHON_3_9, handler=f"{GENERALANNOUNCEMENT_FUNCTIONS_FOLDER}.get_generalannouncement.lambda_handler", code=_lambda.Code.from_asset(FUNCTIONS_FOLDER), role=LAMBDA_ROLE )
        post_generalannouncement = _lambda.Function( self, "postGeneralAnnouncement", runtime=_lambda.Runtime.PYTHON_3_9, handler=f"{GENERALANNOUNCEMENT_FUNCTIONS_FOLDER}.post_generalannouncement.lambda_handler", code=_lambda.Code.from_asset(FUNCTIONS_FOLDER), role=LAMBDA_ROLE,
                                                    environment={
                                                      'SES_SENDER_EMAIL': 'g3fyp2023@gmail.com',
                                                      'SES_RECEIVER_EMAIL': 'aiwei.testt@gmail.com'
                                                    })
        delete_generalannouncement = _lambda.Function( self, "deleteGeneralAnnouncement", runtime=_lambda.Runtime.PYTHON_3_9, handler=f"{GENERALANNOUNCEMENT_FUNCTIONS_FOLDER}.delete_generalannouncement.lambda_handler", code=_lambda.Code.from_asset(FUNCTIONS_FOLDER), role=LAMBDA_ROLE )


        ##############
        ### API GW ###
        ##############

        # define the attributes of the existing REST API
        rest_api_id = Fn.import_value("mainApiId")
        root_resource_id = Fn.import_value("mainApiRootResourceIdOutput")

        # Retrieve the Amazon API Gateway REST API
        main_api = apigw.RestApi.from_rest_api_attributes(
            self, "main", rest_api_id=rest_api_id, root_resource_id=root_resource_id)


        ########################
        ### API GW RESOURCES ###
        ########################

        generalannouncement_resource = main_api.root.add_resource(
            "generalannouncement")


        ################################
        ### API GW RESOURCES METHODS ###
        ################################

        # /generalannouncements
        model = apigw.Model(
                self,
                "PostGeneralAnnouncementModel",
                rest_api=main_api,
                content_type="application/json",
                model_name="PostGeneralAnnouncementModel",
                schema=apigw.JsonSchema(
                    title="PostGeneralAnnouncementModel",
                    schema=apigw.JsonSchemaVersion.DRAFT4,
                    type=apigw.JsonSchemaType.OBJECT,
                    properties={
                        "announcementTitle": apigw.JsonSchema(type=apigw.JsonSchemaType.STRING),
                        "content": apigw.JsonSchema(type=apigw.JsonSchemaType.STRING)
                    },
                    required=["content", "announcementTitle"]))


        generalannouncement_resource.add_method("POST", apigw.LambdaIntegration(post_generalannouncement), request_models={
            "application/json":model
        })
        generalannouncement_resource.add_method("GET", apigw.LambdaIntegration(get_generalannouncement), request_parameters={
            'method.request.querystring.dateId': False
        })
        generalannouncement_resource.add_method("DELETE", apigw.LambdaIntegration(delete_generalannouncement), request_parameters={
            'method.request.querystring.dateId': True
        })


        ############
        ### CORS ###
        ############

        # Enable CORS for each resource/sub-resource etc.
        generalannouncement_resource.add_cors_preflight(
            allow_origins=["*"], allow_methods=["GET", "POST", "DELETE", "PUT"], status_code=200)
