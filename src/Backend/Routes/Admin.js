const express = require("express");
const passport = require("passport");
const Blog = require("../Model/Blog");
const User = require("../Model/User");
const router = express.Router();

// router to fetch blogs pending approval
router.get("/blog/pendingapproval",
passport.authenticate("jwt", {session: false}),
async (req, res) => {
    try{

        const blogs = await Blog.find({ approvalStatus: "pending", isPublicIntended: true});

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
                approvalStatus: blog.approvalStatus,
                rejectionReason: blog.rejectionReason
            };
        }));

        return res.json({ data: formattedBlogs });


    } catch (error){
        console.error("Error fetching blogs that are waiting approval", error);
        return res.json({ message: "Error fetching blogs that are waiting for approval"})
    }
});


// router to make  a decision on whether or not to approve a blog post
router.post("/blog/approve/:blogId",
passport.authenticate("jwt", {session: false}),
async (req, res) => {
    try{
        const userId = req.user._id;
        const { blogId } = req.params;
        const { approve, rejectionReason } = req.body;

        const user = await User.findById(userId);

        // Check if the user is an admin
         if (!user || !user.isAdmin) {
                return res.status(403).json({ message: "Only admins can approve/reject blog posts" });
        }


        const blog = await Blog.findById(blogId);

        // Check if the blog post exists
        if (!blog) {
                return res.status(404).json({ message: "Blog post not found" });
        }

        // Update the approval status based on the decision
        if (approve) {
              blog.approvalStatus = 'approved';
              blog.isPublic = true; // Mark the blog as public
        } else {
              blog.approvalStatus = 'rejected';
              blog.rejectionReason = rejectionReason;
        }

        await blog.save();

        res.json({ message: "Blog approval decision saved successfully" });


    } catch (error){
        console.error("Error  making decision on blog approval:", error);
       return res.json({ Message: "Error  making decision on blog approval"});
    }
});

// router to make a user an admin
router.post("/create",
passport.authenticate("jwt", {session: false}),
async (req, res) => {
    try{

        console.log("Authenticated user:", req.user);

                    // Check if the authenticated user making the request is CodeCrafter
                    if (req.user && req.user.userName !== "CodeCrafter") {
                        return res.status(403).json({ message: "Only CodeCrafter can create new admins" });
                    }

        const { targetUserName } = req.body;

        const userToAdmin = await User.findOne({ userName: targetUserName });

                    // Check if the user exists
                    if (!userToAdmin) {
                        return res.status(404).json({ message: "User not found" });
                    }


        userToAdmin.isAdmin = true;

        await userToAdmin.save(req.user);

        return res.json({ message: `${targetUserName} is now an admin` });

    } catch(error){
        console.error("Error making a user an admin:", error);
        return res.json({ Error: "Error making a user an admin"})
    }
});

module.exports = router;