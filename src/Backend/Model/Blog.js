const mongoose = require("mongoose");

// Define the schema for blog content
const ParagraphSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true
    },
    media: {
        images: {
            type: String,
            default: null
        },
        videos: {
            type: String,
            default: null
        }
    }
});


// Define the blog schema with the updated content structure
const BlogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    paragraph: {
        type: [ParagraphSchema], 
        required: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    isPublicIntended: {
        type: Boolean,
        default: false
    },
    isPublic: {
        type: Boolean,
        default: false
    },
    approvalStatus: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    },
    rejectionReason: {
        type: String,
        default: ""
    }
});

// Define the Blog model
const Blog = mongoose.model("Blog", BlogSchema);

module.exports = Blog;
