const DynamoDB = require("aws-sdk/clients/dynamodb");
const { v4: uuidv4 } = require("uuid");

const { response_200, response_400, response_500 } = require("./responses");

const dynamodb = new DynamoDB.DocumentClient();

function checkForNull(...args) {
    const arguments = [
        "courseId",
        "studentId",
        "quizId",
        "quizScore"
    ];

    for (let i = 0; i < args.length; i++) {
        if (args[i] === undefined || args[i] === "") {
            throw new Error(`Argument ${arguments[i]} cannot be empty`);
        }
    }
}

async function lambda_handler(event, context) {
    const uuid = uuidv4();

    try {
        const requestBody = JSON.parse(event.body);

        const courseId = requestBody.courseId;
        const studentId = requestBody.studentId;
        const quizId = requestBody.quizId;
        const quizScore = requestBody.quizScore;

        checkForNull(
            courseId,
            studentId,
            quizId,
            quizScore
        );

        const getAttemptsParams = {
            TableName: "LMS",
            Key: {
                "PK": `Course#${courseId}`,
                "SK": `Student#${studentId}Quiz#${quizId}`
            },
            AttributesToGet: [
                "QuizAttempt",
                "QuizMaxAttempt"
            ]
        };

        attemptsResponse = await dynamodb.get(getAttemptsParams).promise();
        attempts = attemptsResponse.Item;

        if (attempts.QuizAttempt >= attempts.QuizMaxAttempt) {
            throw new Error("Already attempted max number of times: " + attempts.QuizAttempt);
        }

        const putParams = {
            TableName: "LMS",
            Key: {
                "PK": `Course#${courseId}`,
                "SK": `Student#${studentId}Quiz#${quizId}`
            },
            UpdateExpression: "set QuizScore = :newQuizScore, QuizAttempt = QuizAttempt + :val",
            ExpressionAttributeValues: {
                ":newQuizScore": quizScore,
                ":val": 1
            }
        };

        await dynamodb.update(putParams).promise();

        return response_200(`Quiz ${quizId} successfully submitted`)

    } catch (e) {
        return response_400(e);
    }
}

module.exports = { lambda_handler };
