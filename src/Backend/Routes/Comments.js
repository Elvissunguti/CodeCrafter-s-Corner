const express = require("express");
const Comment = require("../Model/Comments");
const passport = require("passport");
const router = express.Router();


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

module.exports = router;