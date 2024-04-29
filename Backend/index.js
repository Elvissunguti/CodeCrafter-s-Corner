const { onRequest } = require("firebase-functions/v2/https");
const { logger } = require("firebase-functions");

// Rest of your code...

exports.helloWorld = onRequest((request, response) => {
  logger.info("Hello logs!", {structuredData: true});
  response.send("Hello from Firebase!");
});
