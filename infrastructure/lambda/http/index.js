module.exports.handler = async (event) => {
  console.log("Event: ", event);
  return {
    statusCode: 200,
    body: "Congrats! You've successfully deployed a Lambda function!",
  };
};
