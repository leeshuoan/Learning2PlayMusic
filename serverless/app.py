#!/usr/bin/env python3
import os
import sys
import json
import decimal

import boto3
import aws_cdk as cdk

from serverless.course_stack import CourseStack
from serverless.announcement_stack import AnnouncementStack
from serverless.user_stack import UserStack


app = cdk.App()
CourseStack(app, "CourseStack",
            # If you don't specify 'env', this stack will be environment-agnostic.
            # Account/Region-dependent features and context lookups will not work,
            # but a single synthesized template can be deployed anywhere.

            # Uncomment the next line to specialize this stack for the AWS Account
            # and Region that are implied by the current CLI configuration.

            # env=cdk.Environment(account=os.getenv('CDK_DEFAULT_ACCOUNT'), region=os.getenv('CDK_DEFAULT_REGION')),

            # Account and Region you
            # want to deploy the stack to.

            env=cdk.Environment(account='568463424400',
                                region='ap-southeast-1'),


            # For more information, see https://docs.aws.amazon.com/cdk/latest/guide/environments.html
            )
AnnouncementStack(app, "AnnouncementStack",
                  env=cdk.Environment(account='568463424400',
                                      region='ap-southeast-1')),
UserStack(app, "UserStack",
          env=cdk.Environment(account='568463424400',
                                      region='ap-southeast-1'))

app.synth()
