const express = require('express');
const passport = require('passport');
const Comment = require('../Model/Comments');

const router = express.Router();

// router to post a comment under a blog
router.post(
  '/create/:blogId',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      const userId = req.user._id;  
      const { blogId } = req.params;

      const { commentText } = req.body;

      const newComment = new Comment({
        userId,
        blogId,
        commentText,
      });

      await newComment.save();

      return res.json({ message: 'Comment created successfully' });
    } catch (error) {
      console.error('Error posting comments:', error);
      return res.json({ Error: 'Error posting comments' });
    }
  },
);

// router to edit my comment under a blog
router.post(
  '/edit/:commentId',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      const userId = req.user._id;  
      const { commentId } = req.params;

      const { commentText } = req.body;

      const comment = await Comment.findById(commentId);

      if (!comment) {
        return res.json({ Error: 'Comment not found' });
      }

      if (comment.userId.toString() !== userId.toString()) {
        return res.json({ Error: 'You are not authorized to edit this comment' });
      }

      comment.commentText = commentText;
      await comment.save();

      return res.json({ message: 'Comment updated successfully' });
    } catch (error) {
      console.error('Error editing comment:', error);
      return res.json({ Error: 'Error editing comment' });
    }
  },
);

// router to comment under a comment
router.post(
  '/parentcomment/:blogId/:parentCommentId',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      const userId = req.user._id;  
      const { blogId } = req.params;
      const { parentCommentId } = req.params;
      const { commentText } = req.body;

      const newComment = new Comment({
        userId,
        blogId,
        parentCommentId,
        commentText,
      });

      await newComment.save();

      if (parentCommentId) {
        const parentComment = await Comment.findById(parentCommentId);
        if (parentComment) {
          parentComment.replies.push(newComment._id);  
          await parentComment.save();
        }
      }

      return res.json({ message: 'Comment created successfully' });
    } catch (error) {
      console.error('Error posting a comment under a comment:', error);
      return res.json({ error: 'Error posting a comment  under a comment.' });
    }
  },
);

router.get(
  '/fetch/:blogId',
  async (req, res) => {
    try {
      const { blogId } = req.params;

      // Find all top-level comments (comments without parentCommentId)
      const topLevelComments = await Comment.find({ blogId, parentCommentId: null })
        .populate({
          path: 'replies', // Populate replies recursively
          populate: {
            path: 'replies',
            populate: {
              path: 'replies', // Continue populating replies recursively
              // Add more levels if needed
            },
          },
          populate: {  // eslint-disable-line
            path: 'userId', // Populate the userId field to get the user details
            select: 'userName', // Select only the userName field
          },
        })
        .populate('userId', 'userName')
        .sort({ createdAt: 'asc' }); // Sort comments by creation time in ascending order

      return res.json({ data: topLevelComments });
    } catch (error) {
      console.error('Error fetching comments of a blog:', error);
      return res.json({ error: 'Error fetching comments of a blog' });
    }
  },
);

module.exports = router;
