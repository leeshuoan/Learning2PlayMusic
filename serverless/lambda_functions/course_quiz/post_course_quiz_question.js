const DynamoDB = require("aws-sdk/clients/dynamodb");
const S3 = require("aws-sdk/clients/S3");
const { v4: uuidv4 } = require("uuid");

const { response_200, response_400, response_500 } = require("./responses");

const dynamodb = new DynamoDB.DocumentClient();
const s3 = new S3();

const bucketName = process.env.S3_BUCKET_NAME;
const uuid = uuidv4();

function checkForNull(...args) {
  const arguments = [
    "courseId",
    "quizId",
    "questionOptionType",
    "question",
    "options",
    "answer",
  ];

  for (let i = 0; i < args.length; i++) {
    if (args[i] === undefined || args[i] === "") {
      throw new Error(`Argument ${arguments[i]} cannot be empty`);
    }
  }
}

async function lambda_handler(event, context) {
  try {
    const requestBody = JSON.parse(event.body);

    let questionId;
    let isUpdate = false;
    if (requestBody && "questionId" in requestBody) {
      questionId = requestBody.questionId;
      isUpdate = true;
    } else {
      questionId = uuid.slice(0, 8);
    }

    let uploadedImage;
    if (requestBody && "questionImage" in requestBody) {
      const base64Image = requestBody.questionImage;
      const imageBuffer = Buffer.from(base64Image, "base64");
      let s3Key = uuid.slice(0, 8).concat(extension);
      const s3Params = {
        Bucket: bucketName,
        Key: s3Key,
        Body: imageBuffer,
      };

      uploadedImage = await s3.putObject(s3Params).promise();
    }
    const courseId = requestBody.courseId;
    const quizId = requestBody.quizId;
    const questionOptionType = requestBody.questionOptionType;
    const question = requestBody.question;
    const options = requestBody.options;
    const answer = requestBody.answer;

    checkForNull(
      courseId,
      quizId,
      questionOptionType,
      question,
      options,
      answer
    );

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
      },
    };

    if (uploadedImage != null || uploadedImage != undefined) {
      params.Item.questionImage = uploadedImage.Location;
    }
    await dynamodb.put(params).promise();

    if (isUpdate) {
      return response_200(`Successfully updated questionId ${questionId}!`);
    }
    return response_200(
      `Successfully inserted Question ${question} with questionId ${questionId}!`
    );
  } catch (e) {
    return response_400(e);
  }
}

module.exports = { lambda_handler };
