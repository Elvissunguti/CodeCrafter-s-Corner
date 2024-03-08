const express = require("express");
const Comment = require("../Model/Comments");
const passport = require("passport");
const router = express.Router();



// router to post a comment under a blog
router.post("/create/:blogId",
passport.authenticate("jwt", {session: false}),
async (req, res) => {
    try{

        const userId = req.user._id;
        const blogId = req.params.postId;

        const commentText = req.body.commentText;

        const newComment = new Comment({
            userId,
            blogId,
            commentText
        });

        await newComment.save();

        res.json({ message: "Comment created successfully" });

    } catch(error){
        console.error("Error posting comments:", error);
        return res.json({ Error: "Error posting comments" });
    }
});


// router to edit my comment under a blog
router.post("/edit/:commentId",
passport.authenticate("jwt", {session: false}),
async (req, res) => {
    try{
        const userId = req.user._id;
        const commentId = req.params.commentId;

        const updatedCommentText = req.body.updatedCommentText;

        const comment = await Comment.findById(commentId);

        if (!comment) {
            return res.json({ Error: "Comment not found" });
        }

        if(comment.userId.toString() !== userId.toString()){
            return res.json({ Error: "You are not authorized to edit this comment" });
        }

        comment.commentText = updatedCommentText;
        await comment.save();

        res.json({ message: "Comment updated successfully" });

    } catch(error){
        console.error("Error editing comment:", error);
        return res.json({ Error: "Error editing comment" });
    }
});


module.exports = router;