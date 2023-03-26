const DynamoDB = require("aws-sdk/clients/dynamodb");
const AWS = require("aws-sdk");
const { v4: uuidv4 } = require("uuid");

const { response_200, response_400, response_500 } = require("./responses");

const dynamodb = new DynamoDB.DocumentClient();
const s3 = new AWS.S3();

const bucketName = process.env.QUESTION_IMAGE_BUCKET_NAME;

async function lambda_handler(event, context) {
  const uuid = uuidv4();

  try {
    const requestBody = JSON.parse(event.body);

    for (question in requestBody) {
      let questionId = uuid.slice(0, 8);
      const courseId = question.courseId;
      const quizId = question.quizId;
      const questionOptionType = question.questionOptionType;
      const question = question.question;
      const options = question.options;
      const answer = question.answer;

      let uploadedImage;
      let s3Params;
      if (
        question &&
        "questionImage" in question &&
        question["questionImage"] != ""
      ) {
        const base64data = question.questionImage;
        const fileExtension = base64data.split(";")[0].split("/")[1];
        const base64Image = base64data.replace(/^data:image\/\w+;base64,/, "");
        const imageBuffer = Buffer.from(base64Image, "base64");
        s3Params = {
          Bucket: bucketName,
          Key: `Course${courseId}/Quiz${quizId}/Question${questionId}.${fileExtension}`,
          Body: imageBuffer,
          ContentType: "image/" + fileExtension,
        };

        uploadedImage = await s3.putObject(s3Params).promise();
      }

      if (!options.includes(answer)) {
        throw new Error("answer must be one of the options");
      }

      const params = {
        TableName: "LMS",
        Item: {
          PK: `Course#${courseId}`,
          SK: `Quiz#${quizId}Question#${questionId}`,
          QuestionOptionType: questionOptionType,
          Question: question,
          Options: options,
          Answer: answer,
          Attempts: 0,
          Correct: 0,
        },
      };

      if (
        "questionImage" in question &&
        question["questionImage"] != ""
      ) {
        params.Item.questionImage = s3Params.Bucket + "/" + s3Params.Key;
      }
      await dynamodb.put(params).promise();
    }

    return response_200(
      `Successfully inserted Question ${question} with questionId ${questionId}!`
    );
  } catch (e) {
    return response_400(e);
  }
}

module.exports = { lambda_handler };
