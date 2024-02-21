const multer = require("multer");
const path = require("path");

// Configure multer storage for both images and videos
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        let destinationPath;
        if (file.fieldname === "images") {
            destinationPath = path.join(__dirname, "../../../public/Images");
        } else if (file.fieldname === "videos") {
            destinationPath = path.join(__dirname, "../../../public/Videos");
        }
        cb(null, destinationPath);
    },
    filename: (req, file, cb) => {
        const uniquePrefix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        const extension = path.extname(file.originalname);
        cb(null, uniquePrefix + extension);
    }
});

// Combine multer storage configurations for both images and videos
const blogUploads = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        // Validate file types here if needed
        cb(null, true);
    }
}).fields([
    { name: "images", maxCount: 10 },
    { name: "videos", maxCount: 10 } 
]);

module.exports = { blogUploads };
