const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient();
const { v4: uuidv4 } = require('uuid');

exports.handler = async (event, context) => {

  // Generate a new UUID
    const uuid = uuidv4();
    const questionId = uuid.slice(0, 8);

    try {
        const requestBody = JSON.parse(event.body);
        const courseId = requestBody.courseId;
        const quizId = requestBody.quizId;
        const questionOptionType = requestBody.questionOptionType
        const question = requestBody.question
        const options = requestBody.options
        const answer = requestBody.answer

        const params = {
            TableName: "LMS",
            Item: {
                "PK": "Course#"`${courseId}`,
                "SK": "Quiz#"`${quizId}`+"QuestionId#"`${questionId}`,
                "QuestionOptionType": questionOptionType,
                "Question": question,
                "Options": options,
                "Answer": answer,
            }
        };
        const dbResponse = await dynamodb.put(params).promise();

        return {
            "statusCode": 200,
            "headers": {
                "Access-Control-Allow-Headers": "Content-Type",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "POST,GET,PUT"
            },
            "body": "Successfully inserted item!"
        };
    } catch (e) {
        console.error(`Exception: ${e}`);
        return {
            "statusCode": 500,
            "body": String(e),
        };
    }
};