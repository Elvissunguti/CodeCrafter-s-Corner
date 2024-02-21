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

        return res.json({ data: blogs});

    } catch (error){
        console.error("Error fetching blogs that are waiting approval", error);
        res.json({ message: "Error fetching blogs that are waiting for approval"})
    }
});

// router to make  a decision on whether or not to approve a blog post
router.post("/blog/approve/:blogId",
passport.authenticate("jwt", {session: false}),
async (req, res) => {
    try{
        const userId = req.user._id;
        const { blogId } = req.params;
        const { approve } = req.body;

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
        }

        await blog.save();

        res.json({ message: "Blog approval decision saved successfully" });


    } catch (error){
        console.error("Error  making decision on blog approval", error);
        res.json({ Message: "Error  making decision on blog approval"});
    }
});




module.exports = router;