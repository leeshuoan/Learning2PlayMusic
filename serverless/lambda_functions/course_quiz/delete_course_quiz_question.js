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
    const qnNumber = requestBody.qnNumber;

    checkNumQuestions(courseId, quizId);

    const params = {
      TableName: "LMS",
      Key: {
        PK: `Course#${courseId}`,
        SK: `Quiz#${quizId}Question#${qnNumber}`,
      },
    };

    const result = await dynamodb.get(params).promise();

    if (!result.Item) {
      return response_400(`Item with courseId:${courseId} quizId:${quizId} qnNumber:${qnNumber} not found`);
    }

    await dynamodb.delete(params).promise();

    return response_200(`Successfully deleted item with courseId:${courseId} quizId:${quizId} qnNumber:${qnNumber}!`);

  } catch (e) {
    return response_400(e);
  }
}

module.exports = { lambda_handler };
