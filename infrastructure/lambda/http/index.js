module.exports.handler = async (event) => {
  return {
    statusCode: 200,
    body: "Congrats! You've successfully deployed a Lambda function!",
  };
};
