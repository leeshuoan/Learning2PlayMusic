const response_200 = (success_msg) => ({
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST,GET,DELETE"
    },
    body: JSON.stringify({ message: `[SUCCESS] ${success_msg}` })
  });
  
  const response_400 = (error_msg) => ({
    statusCode: 400,
    headers: {
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST,GET,DELETE"
    },
    body: JSON.stringify({ message: `[ERROR] ${error_msg}` })
  });
  
  const response_500 = (error_msg) => ({
    statusCode: 500,
    headers: {
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST,GET,DELETE"
    },
    body: JSON.stringify({ message: `[ERROR] ${error_msg}` })
  });
  
module.exports = { response_200, response_400, response_500 };
  