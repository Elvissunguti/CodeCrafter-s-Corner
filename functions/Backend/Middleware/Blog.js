const multer = require("multer");
const {v4: uuidv4} = require("uuid");
const firebase = require("firebase-admin");
const serviceAccount = require("../../serviceAccountKey.json");

firebase.initializeApp({
  credential: firebase.credential.cert(serviceAccount),
  storageBucket: "codecrafter-s-corner.appspot.com",
});

const storage = firebase.storage();
const bucket = storage.bucket();

// Configure Multer to store files in memory
const multerStorage = multer.memoryStorage();

const multerConfig = multer({
  storage: multerStorage,
  fileFilter: (req, file, cb) => {
    cb(null, true);
  },
}).fields([
  {name: "thumbnail", maxCount: 1},
  {name: "media", maxCount: 10},
]);

// Helper function to upload file to Firebase Storage
const uploadFileToFirebase = async (file) => {
  const fileName = `${uuidv4()}-${file.originalname}`;
  const fileRef = bucket.file(fileName);

  await fileRef.save(file.buffer, {
    metadata: {
      contentType: file.mimetype,
    },
  });

  const fileURL = await fileRef.getSignedUrl({
    action: "read",
    expires: "03-01-2500", // Long expiry date for testing purposes
  });

  return fileURL[0];
};

module.exports = {
  multerConfig,
  uploadFileToFirebase,
};
