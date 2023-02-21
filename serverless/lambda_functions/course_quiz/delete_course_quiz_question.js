const DynamoDB = require("aws-sdk/clients/dynamodb");

const { response_200, response_400, response_500 } = require("./responses");

const dynamodb = new DynamoDB.DocumentClient();

function checkForNull(...args) {
  for (let i = 0; i < args.length; i++) {
    if (args[i] === null) {
      throw new Error(`Argument ${i + 1} cannot be null`);
    }
  }
}

function lambda_handler(event, context) {
  try {
    const requestBody = event.body;
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
    dynamodb.delete(params, (err, data) => {
        if (err) {
          return response_400(err);
        } else {
          return response_200("Successfully deleted item!");
        }
      })

    return response_200("Successfully deleted item!");
  } catch (e) {
    return response_400(e);
  }
}

module.exports = { lambda_handler };
