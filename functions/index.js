const {onRequest} = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");

// Create and deploy your first function
// Replace 'myFunction' with your function name
exports.myFunction = onRequest((request, response) => {
  // Log a message using the logger
  logger.info("Hello logs!", {structuredData: true});

  // Send a response to the client
  response.send("Hello from Firebase!");
});
