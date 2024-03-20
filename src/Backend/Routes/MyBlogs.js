const express = require("express");
const passport = require("passport");
const Blog = require("../Model/Blog");
const User = require("../Model/User");
const router = express.Router();


// router to fetch user's public Blog
router.get("/public/blogs/:currentUserId",
passport.authenticate("jwt", {session: false}),
async (req, res) => {
    try{
        const currentUserId = req.params.currentUserId;

        if (!currentUserId) {
            return res.status(400).json({ error: "currentUserId is missing" });
        }

        // Add validation to ensure currentUserId belongs to the authenticated user
        if (currentUserId !== req.user.id) {
            return res.status(403).json({ error: "Unauthorized access to user's blogs" });
        }

        const blogs = await Blog.find({
            author: currentUserId,
            isPublic: true,
            approvalStatus: "approved"
        });

        const formattedBlogs =  await Promise.all(blogs.map(async (blog) => {
            const author = await User.findById(blog.author);

            const paragraphs = blog.paragraph.map((paragraph) => {
                return {
                    content: paragraph.content,
                    media: {
                        images: paragraph.media.images ? `/${paragraph.media.images}` : null,
                        videos: paragraph.media.videos ? `/${paragraph.media.videos}` : null
                    }
                };
            });

            return {
                blogId: blog._id,
                title: blog.title,
                thumbnail: blog.thumbnail ? `/${blog.thumbnail}` : null,
                paragraphs: paragraphs,
                userName: author ? author.userName : "Unknown",
            };
        }));

        return res.json({ data: formattedBlogs });

    } catch (error){
        console.error("Error getting public blogs of the current user", error);
        return res.json({ error: "Error getting public blogs of the current user"});

    }
});


// router to fetch approved Blogs
router.get("/approved/blogs/:currentUserId",
passport.authenticate("jwt", {session: false}),
async (req, res) => {
    try{

        const currentUserId = req.params.currentUserId;

        const approvedBlogs = await Blog.find({
            author: currentUserId,
            approvalStatus: 'approved',
            isPublic: false
        });

        const formattedBlogs =  await Promise.all(approvedBlogs.map(async (blog) => {
            const author = await User.findById(blog.author);

            const paragraphs = blog.paragraph.map((paragraph) => {
                return {
                    content: paragraph.content,
                    media: {
                        images: paragraph.media.images ? `/${paragraph.media.images}` : null,
                        videos: paragraph.media.videos ? `/${paragraph.media.videos}` : null
                    }
                };
            });

            return {
                blogId: blog._id,
                title: blog.title,
                thumbnail: blog.thumbnail ? `/${blog.thumbnail}` : null,
                paragraphs: paragraphs,
                userName: author ? author.userName : "Unknown",
                approvalStatus: blog.approvalStatus
            };
        }));

        return res.json({ data: formattedBlogs });

    } catch (error){
        console.error("Error fetching approved blogs", error);
        return res.json({ error: "Error fetching approved blogs" });
    }
});


// router to fetch pending and rejected blogs
router.get("/pending/rejected/blog/:currentUserId",
passport.authenticate("jwt", {session: false}),
async (req, res) => {
    try{

        const currentUserId = req.params.currentUserId;

        const pendingRejectedBlogs = await  Blog.find({
            author: currentUserId,
            isPublicIntended: true,
            approvalStatus: {$in : ["pending", 'rejected']}
        });

        const formattedBlogs =  await Promise.all(pendingRejectedBlogs.map(async (blog) => {
            const author = await User.findById(blog.author);

            const paragraphs = blog.paragraph.map((paragraph) => {
                return {
                    content: paragraph.content,
                    media: {
                        images: paragraph.media.images ? `/${paragraph.media.images}` : null,
                        videos: paragraph.media.videos ? `/${paragraph.media.videos}` : null
                    }
                };
            });

            return {
                blogId: blog._id,
                title: blog.title,
                thumbnail: blog.thumbnail ? `/${blog.thumbnail}` : null,
                paragraphs: paragraphs,
                userName: author ? author.userName : "Unknown",
                approvalStatus: blog.approvalStatus,
                rejectionReason: blog.rejectionReason
            };
        }));

        return res.json({ data: formattedBlogs });
         
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