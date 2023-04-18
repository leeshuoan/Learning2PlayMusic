import aws_cdk as core
import aws_cdk.assertions as assertions
from serverless.course_stack import CourseStack

# example tests. To run these tests, uncomment this file along with the example
# resource in serverless/serverless_stack.py
def test_question_image_bucket_created():
    app = core.App()
    stack = CourseStack(app, "CourseStack")
    template = assertions.Template.from_stack(stack)

    template.has_resource("AWS::S3::Bucket", {
        "Properties": {
            "BucketName": "L2PMAQuestionImageBucket"
        }
    })

def test_homework_submission_bucket_created():
    app = core.App()
    stack = CourseStack(app, "CourseStack")
    template = assertions.Template.from_stack(stack)

    template.has_resource("AWS::S3::Bucket", {
        "Properties": {
            "BucketName": "L2PMAHomeworkSubmissionBucket" 
        }
    })

def test_material_attachment_bucket_created():
    app = core.App()
    stack = CourseStack(app, "CourseStack")
    template = assertions.Template.from_stack(stack)

    template.has_resource("AWS::S3::Bucket", {
        "Properties": {
            "BucketName": "L2MPMAMaterialAttachmentBucket" 
        }
    })

