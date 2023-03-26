const DynamoDB = require("aws-sdk/clients/dynamodb");
const { v4: uuidv4 } = require("uuid");

const { response_200, response_400, response_500 } = require("./responses");

const dynamodb = new DynamoDB.DocumentClient();

async function lambda_handler(event, context) {
  const uuid = uuidv4();

  try {
    const requestBody = JSON.parse(event.body);

    const courseId = requestBody.courseId;
    const studentId = requestBody.studentId;
    const quizId = requestBody.quizId;
    const submissions = requestBody.submissions;
    let quizScore = 0;

    const getAttemptsParams = {
      TableName: "LMS",
      Key: {
        PK: `Course#${courseId}`,
        SK: `Student#${studentId}Quiz#${quizId}`,
      },
      AttributesToGet: ["QuizAttempt", "QuizMaxAttempt"],
    };

    attemptsResponse = await dynamodb.get(getAttemptsParams).promise();
    attempts = attemptsResponse.Item;

    if (attempts.QuizAttempt >= attempts.QuizMaxAttempt) {
      throw new Error(
        "Already attempted max number of times: " + attempts.QuizAttempt
      );
    }

    const getQuestionParam = {
      TableName: "LMS",
      KeyConditionExpression: "PK = :pk and begins_with(SK, :sk)",
      ExpressionAttributeValues: {
        ":pk": `Course#${courseId}`,
        ":sk": `Quiz#${quizId}Question#`,
      },
    };
    questions_query = await dynamodb.query(getQuestionParam).promise();
    questions = questions_query.Items;
    numQuestions = questions.length;

    for (const question of questions) {
      const SK = question.SK;
      const questionId = SK.split("Question#")[1];
      const submissionKey = "Question#" + questionId;
      let correct = 0;
      if (question.Answer == submissions[submissionKey]) {
        correct = 1;
        quizScore += 1
      }
      const updateQuestionParams = {
        TableName: "LMS",
        Key: {
          PK: `Course#${courseId}`,
          SK: `Quiz#${quizId}Question#${questionId}`,
        },
        UpdateExpression:
          "set Attempts = Attempts + :incr, Correct = Correct + :val",
        ExpressionAttributeValues: {
          ":val": correct,
          ":incr": 1
        },
      };
      await dynamodb.update(updateQuestionParams).promise();
    }

    const updateStudentQuizParams = {
      TableName: "LMS",
      Key: {
        PK: `Course#${courseId}`,
        SK: `Student#${studentId}Quiz#${quizId}`,
      },
      UpdateExpression:
        "set QuizScore = :newQuizScore, QuizAttempt = QuizAttempt + :val",
      ExpressionAttributeValues: {
        ":newQuizScore": quizScore / numQuestions,
        ":val": 1,
      },
    };

    await dynamodb.update(updateStudentQuizParams).promise();

    return response_200(`Quiz ${quizId} successfully submitted`);
  } catch (e) {
    return response_400(e);
  }
}

module.exports = { lambda_handler };
