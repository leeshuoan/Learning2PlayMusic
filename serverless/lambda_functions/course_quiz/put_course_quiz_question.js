const DynamoDB = require("aws-sdk/clients/dynamodb");
const AWS = require("aws-sdk");

const { response_200, response_400, response_500 } = require("./responses");

const dynamodb = new DynamoDB.DocumentClient();
const s3 = new AWS.S3();

const bucketName = process.env.QUESTION_IMAGE_BUCKET_NAME;

async function lambda_handler(event, context) {
  try {

    const requestBody = JSON.parse(event.body);

    const courseId = requestBody.courseId;
    const quizId = requestBody.quizId;
    const questionOptionType = requestBody.questionOptionType;
    const questionText = requestBody.question;
    const options = requestBody.options;
    const answer = requestBody.answer;
    const qnNumber = requestBody.qnNumber;

    const optionsStats = {};
    for (let option of options) {
      optionsStats[option] = 0;
    }

    let uploadedImage;
    let s3Params;
    if (requestBody && "questionImage" in requestBody && requestBody["questionImage"] != "") {
      const base64data = requestBody.questionImage;
      const fileExtension = base64data.split(";")[0].split("/")[1];
      const base64Image = base64data.replace(/^data:image\/\w+;base64,/, "");
      const imageBuffer = Buffer.from(base64Image, "base64");
      s3Params = {
        Bucket: bucketName,
        Key: `Course${courseId}/Quiz${quizId}/Question${qnNumber}.${fileExtension}`,
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
        SK: `Quiz#${quizId}Question#${qnNumber}`,
        QuestionOptionType: questionOptionType,
        Question: questionText,
        Options: options,
        Answer: answer,
        Attempts: 0,
        Correct: 0,
        ...optionsStats,
      },
    };

    if ("questionImage" in requestBody && requestBody["questionImage"] != "") {
      params.Item.QuestionImage = s3Params.Bucket + "/" + s3Params.Key;
    }
    await dynamodb.put(params).promise();


    return response_200(`Successfully updated ${qnNumber} Question(s)!`);
  } catch (e) {
    return response_400(e);
  }
}

module.exports = { lambda_handler };
