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


// router to fetch approved Blogs
router.get("/approved/blogs/:author",
passport.authenticate("jwt", {session: false}),
async (req, res) => {
    try{

        const author = req.params.author;

        const approvedBlogs = await Blog.find({
            author: author,
            approvalStatus: 'approved',
            isPublic: false
        });

        return res.json({ data: approvedBlogs});

    } catch (error){
        console.error("Error fetching approved blogs", error);
        return res.json({ error: "Error fetching approved blogs" });
    }
});


// router to fetch pending and rejected blogs
router.get("/pending/rejected/blog/:author",
passport.authenticate("jwt", {session: false}),
async (req, res) => {
    try{

        const author = req.params.author;

        const blogs = await  Blog.find({
            author: author,
            approvalStatus: {$in : ["pending", 'approved']}
        });

        return res.json({ data: blogs });
         
    }catch (error){
        console.error("Error fetching pending or rejected blogs");
        return res.json({ error: "fetching pending or rejected blogs" });
    }
});


//route to fetch private blogs
router.get("/private/blogs/:author",
passport.authenticate("jwt", {session: false}),
async (req, res) => {
    try{

        const author = req.params.author;

        const privateBlogs = await Blog.find({
            author: author,
            isPublicIntended: false
        });

        return res.json({ data: privateBlogs })

    } catch (error){
        console.error("Error fetching private blogs that are not public", error);
        return res.json({ error: "Error fetching private blogs that are not public" });
    }
});

module.exports = router;