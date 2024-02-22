const express = require("express");
const passport = require("passport");
const router = express.Router();
const Blog = require("../Model/Blog");
const { blogUploads } = require("../Middleware/Blog");


// router to create a blog 
router.post("/create",
passport.authenticate("jwt", {session: false}),
async (req, res) => {
    blogUploads(req, res, async (err) => {
        if(err){
            return res.json({ err: "Failed to upload files" });
        }
        try{

            const { content } = req.body;
            const author = req.user._id;

            // Initialize empty arrays for images and videos
            let images = [];
            let videos = [];
            
            // Check if images are uploaded and assign their filenames
            if (req.files["images"]) {
                  images = req.files["images"].map(file => file.filename);
            }
            
            // Check if videos are uploaded and assign their filenames
            if (req.files["videos"]) {
                  videos = req.files["videos"].map(file => file.filename);
            }
        
            const newBlog = new Blog({
                content,
                images,
                videos,
                author,
            });
        
            await newBlog.save();
        
            return res.json({ Message: "Blog created successfully"});
        
        } catch(error){
            console.error("Error creating blog:", error);
            return res.json({ error: "Error creating blog" });
        }
    })
});

// router to fetch public blogs
router.get("/publicblog",
async (req, res) => {
    try{

        const approvedPublicBlogs = await Blog.find({ approvalStatus: 'approved', isPublic: true });

        return res.json({ data: approvedPublicBlogs});


    } catch (error){
        console.error("Error fetching public blogs", error);
        return res.json({ Error: "Error fetching public blogs" });
    }
});

module.exports = router;


