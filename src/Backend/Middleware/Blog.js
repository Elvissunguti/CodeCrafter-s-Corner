
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const fileType = file.mimetype.split("/")[0];
        let destinationPath = "";
        if (fileType === "image") {
            destinationPath = path.join(__dirname, "../../../public/Images");
        } else if (fileType === "video") {
            destinationPath = path.join(__dirname, "../../../public/Videos");
        } else if (file.fieldname === "thumbnail") {
            destinationPath = path.join(__dirname, "../../../public/Thumbnails");
        }
        cb(null, destinationPath);
    },
    filename: (req, file, cb) => {
        const uniquePrefix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        const extension = path.extname(file.originalname);
        cb(null, uniquePrefix + extension);
    }
});

const multerConfig = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        cb(null, true);
    }
});

module.exports = multerConfig;
