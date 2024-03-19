const express = require("express");
const passport = require("passport");
const Blog = require("../Model/Blog");
const router = express.Router();


// router to fetch user's public Blog
router.get("/public/blogs/:author",
passport.authenticate("jwt", {session: false}),
async (req, res) => {
    try{
        const author = req.params.author;

        const blogs = await Blog.find({
            author: author,
            isPublic: true
        });

        return res.json({ data: blogs})

    } catch (error){
        console.error("Error getting public blogs of the current user", error);
        return res.json({ error: "Error getting public blogs of the current user"});

    }
});

module.exports = router;