const multer = require("multer");
const path = require("path");

// Configure multer storage for images
const imageStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, "../../../public/Images"));
    },
    filename: (req, file, cb) => {
        const uniquePrefix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        const extension = path.extname(file.originalname);
        cb(null, uniquePrefix + extension);
    }
});

// Configure multer storage for videos
const videoStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, "../../../public/Videos"));
    },
    filename: (req, file, cb) => {
        const uniquePrefix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        const extension = path.extname(file.originalname);
        cb(null, uniquePrefix + extension);
    }
});

// Combine multer storage configurations for both images and videos
const blogUploads = multer({
    storage: multer.diskStorage({}),
    fileFilter: (req, file, cb) => {
        // Validate file types here if needed
        cb(null, true);
    }
}).fields([
    { name: "images", maxCount: 10 },
    { name: "videos", maxCount: 10 } 
]);

module.exports = { blogUploads };
