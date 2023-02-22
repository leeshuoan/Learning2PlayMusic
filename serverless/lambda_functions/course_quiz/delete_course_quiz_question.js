const DynamoDB = require("aws-sdk/clients/dynamodb");

const { response_200, response_400, response_500 } = require("./responses");

const dynamodb = new DynamoDB.DocumentClient();

function checkForNull(...args) {
  const arguments = [
    "courseId",
    "quizId",
    "questionId",
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
    const courseId = requestBody.courseId;
    const quizId = requestBody.quizId;
    const questionId = requestBody.questionId;

    checkForNull(courseId, quizId, questionId);

    const params = {
      TableName: "LMS",
      Key: {
        PK: `Course#${courseId}`,
        SK: `Quiz#${quizId}Question#${questionId}`,
      },
    };

    const result = await dynamodb.get(params).promise();
    if (!result.Item) {
      return response_400(`Item with courseId:${courseId} quizId:${quizId} questionId:${questionId} not found`);
    }

    await dynamodb.delete(params).promise();

    return response_200(`Successfully deleted item with courseId:${courseId} quizId:${quizId} questionId:${questionId}!`);
    
  } catch (e) {
    return response_400(e);
  }
}

module.exports = { lambda_handler };
