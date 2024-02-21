const mongoose = require("mongoose");

const Blog = new mongoose.Schema({
    content: {
        type: String,
        required: true,
    },
    images: {
        type: [String],
    },
    videos: {
        type: [String],
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",

    },

});

const BlogModel = mongoose.model("Blog", Blog);

module.exports = BlogModel;