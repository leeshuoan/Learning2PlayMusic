const DynamoDB = require('aws-sdk/clients/dynamodb');
const { v4: uuidv4 } = require('uuid');

const dynamodb = new DynamoDB.DocumentClient();

function checkForNull(...args){
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
    console.log("BEFORE TRY BLOCK")
    console.log(event)

    try {
        const requestBody = event.body;
        const courseId = requestBody.courseId;
        const quizId = requestBody.quizId;
        const questionOptionType = requestBody.questionOptionType;
        const question = requestBody.question;
        const options = requestBody.options;
        const answer = requestBody.answer;
        console.log("BEFORE CHECK FOR NULL")
        checkForNull(courseId, quizId, questionOptionType, question, options, answer);
        console.log("AFTER CHECK FOR NULL")

        const params = {
            TableName: "LMS",
            Item: {
                "PK": `Course#${courseId}`,
                "SK": `Quiz#${quizId}QuestionId#${questionId}`,
                "QuestionOptionType": questionOptionType,
                "Question": question,
                "Options": options,
                "Answer": answer,
            }
        };
        await dynamodb.put(params).promise();

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
            "body": e.message,
        };
    }
}

module.exports = {lambda_handler};