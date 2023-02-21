const DynamoDB = require("aws-sdk/clients/dynamodb");
const { v4: uuidv4 } = require("uuid");

const {
  response_200,
  response_400,
  response_500,
} = require("./responses");

const dynamodb = new DynamoDB.DocumentClient();

function checkForNull(...args) {
  for (let i = 0; i < args.length; i++) {
    if (args[i] === null) {
      throw new Error(`Argument ${i + 1} cannot be null`);
    }
  }
}


async function lambda_handler(event, context) {
  // Generate a new UUID
  const uuid = uuidv4();
  const questionId = uuid.slice(0, 8);

  try {
    const requestBody = event.body;
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
    await dynamodb.put(params).promise();

    return response_200("Successfully inserted item!");
  } catch (e) {
    return response_400(e)
  }
}

module.exports = { lambda_handler };
