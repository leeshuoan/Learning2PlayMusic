const DynamoDB = require("aws-sdk/clients/dynamodb");

const { response_200, response_400, response_500 } = require("./responses");

const dynamodb = new DynamoDB.DocumentClient();

const checkNumQuestions = async (courseId, quizId) => {
  const params = {
    TableName: "LMS",
    KeyConditionExpression: "PK = :PK and begins_with(SK, :SK)",
    ExpressionAttributeValues: {
      ":PK": `Course#${courseId}`,
      ":SK": `Quiz#${quizId}Question#`
    }
  };

  const quizResponse = await dynamodb.query(params).promise();

  if (quizResponse.Count == 1) {
    throw new Error("Cannot delete question because there is only 1 question in the quiz")
  }
}

async function lambda_handler(event, context) {
  try {
    const requestBody = JSON.parse(event.body);
    const courseId = requestBody.courseId;
    const quizId = requestBody.quizId;
    const questionId = requestBody.questionId;

    checkNumQuestions(courseId, quizId);

    const questionParams = {
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

    await dynamodb.delete(questionParams).promise();

    const quizParams = {
      TableName: "LMS",
      Key: {
        PK: `Course#${courseId}`,
        SK: `Quiz#${quizId}`
      },
      UpdateExpression: 'SET QuestionCount = QuestionCount - :val',
      ExpressionAttributeValues: {
        ':val': 1
      }
    }
    await dynamodb.update(quizParams).promise();

    return response_200(`Successfully deleted item with courseId:${courseId} quizId:${quizId} questionId:${questionId}!`);

  } catch (e) {
    return response_400(e);
  }
}

module.exports = { lambda_handler };
