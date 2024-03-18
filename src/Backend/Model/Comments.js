const mongoose = require("mongoose");


const CommentSchema = new mongoose.Schema({
    blogId: {
        type: mongoose.Schema.Types.ObjectId,
        ref:"Blog"
    },
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    parentCommentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment"   
    },
    commentText: {
        type: String,
        required: true
    },
    replies: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment"
    }],
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});


CommentSchema.pre("save", function(next) {
    this.updatedAt = new Date();
    next();
});


const Comment = mongoose.model("Comment",  CommentSchema);

module.exports = Comment;