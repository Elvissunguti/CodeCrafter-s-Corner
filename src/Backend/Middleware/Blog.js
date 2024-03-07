const multer = require("multer");
const path = require("path");

// Configure multer storage for media files
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // Determine destination folder based on file type (image or video)
        const fileType = file.mimetype.split("/")[0];
        let destinationPath = "";
        if (fileType === "image") {
            destinationPath = path.join(__dirname, "../../../public/Images");
        } else if (fileType === "video") {
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

// multer middleware to handle media uploads
const blogUploads = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        // Validate file types here if needed
        cb(null, true);
    }
}).array('media');  

module.exports = { blogUploads };
