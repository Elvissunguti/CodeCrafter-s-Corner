const express = require("express");
const passport = require("passport");
const router = express.Router();
const Blog = require("../Model/Blog");
const { blogUploads } = require("../Middleware/Blog");
const User = require("../Model/User");
const fs = require("fs");


const getMediaType = (filename) => {
    const extension = filename.split('.').pop().toLowerCase();
    const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg', 'webp', 'jfif', 'tiff', 'ico', 'psd', 'ai', 'eps', 'raw', 'xcf', 'pdf'];
    const videoExtensions = ['mp4', 'avi', 'mov', 'wmv', 'mkv', 'flv', 'webm', 'mpeg', '3gp', 'mpg', 'm4v', 'm2v', 'swf', 'vob'];

    if (imageExtensions.includes(extension)) {
        return 'image';
    } else if (videoExtensions.includes(extension)) {
        return 'video';
    } else {
        return null; // Unsupported media type
    }
};



// router to create a blog 
router.post("/create",
passport.authenticate("jwt", {session: false}),
async (req, res) => {
    blogUploads(req, res, async (err) => {
        if(err){
            console.error("Error uploading files:", err);
            return res.json({ err: "Failed to upload files" });
        }
        try{

            const { title } = req.body;
            const author = req.user._id; 

            // Create an array to store the content paragraphs
            const paragraphs = req.body.content.map(JSON.parse); // Parse the content JSON string

            // Create an array to store media filenames
            const mediaFiles = req.files.map(file => file.filename);

            // Create a new blog instance
            const newBlog = new Blog({
                title,
                paragraph: paragraphs.map((paragraph, index) => {
                    const mediaType = getMediaType(req.files[index]?.filename); // Determine media type based on filename
                    return {
                        content: paragraph.content,
                        media: {
                            images: mediaType === 'image' ? mediaFiles[index] : null,
                            videos: mediaType === 'video' ? mediaFiles[index] : null
                        }
                    };
                }),
                author
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

        const formattedBlogs =  await Promise.all(approvedPublicBlogs.map(async (blog) => {
            const author = await User.findById(blog.author);

            return {
                id: blog._id,
                title: blog.title,
                content: blog.content,
                userName: author ? author.userName : "Unknown",
                images: blog.images,
                videos: blog.videos,
            };
        }));

        return res.json({ data: formattedBlogs });


    } catch (error){
        console.error("Error fetching public blogs", error);
        return res.json({ Error: "Error fetching public blogs" });
    }
});


// router to fetch a particular blog
router.get("/fetch/:blogId",
async (req, res) => {
    try{

        const blogId = req.params.blogId;

        const blog = await Blog.findById(blogId, 'title author content _id images videos');

        const user = await User.findById(blog.author, 'userName');

        
        // Adding userName to the blog object
        const blogWithUserName = {
            ...blog.toObject(),
            userName: user.userName
        };


        return res.json({ data: blogWithUserName });

    } catch(error){
        console.error("Error fetching a particular blog:", error);
        return res.json({ Error: "Error fetching a particular blog" });
    }
});

module.exports = router;


