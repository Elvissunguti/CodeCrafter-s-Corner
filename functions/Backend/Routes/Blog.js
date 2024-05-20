/* eslint-disable */
const express = require("express");
const passport = require("passport");
const router = express.Router();
const Blog = require("../Model/Blog");
const {multerConfig, uploadFileToFirebase} = require("../Middleware/Blog");
const User = require("../Model/User");

const getMediaType = (filename) => {
  const extension = filename.split(".").pop().toLowerCase();
  const imageExtensions = ["jpg", "jpeg", "png", "gif", "bmp", "svg", "webp", "jfif", "tiff", "ico", "psd", "ai", "eps", "raw", "xcf", "pdf"];
  const videoExtensions = ["mp4", "avi", "mov", "wmv", "mkv", "flv", "webm", "mpeg", "3gp", "mpg", "m4v", "m2v", "swf", "vob"];

  if (imageExtensions.includes(extension)) {
    return "image";
  } else if (videoExtensions.includes(extension)) {
    return "video";
  } else {
    return null; // Unsupported media type
  }
};

router.post(
    "/create",
    passport.authenticate("jwt", {session: false}),
    multerConfig,
    async (req, res) => {
      try {
        const {title, content} = req.body;
        const author = req.user._id;

        const thumbnailFile = req.files["thumbnail"] ? req.files["thumbnail"][0] : null;
        const mediaFiles = req.files["media"] || [];

        const thumbnail = thumbnailFile ? await uploadFileToFirebase(thumbnailFile) : null;

        const parsedContent = JSON.parse(content);

        const paragraphs = await Promise.all(parsedContent.map(async (paragraph, index) => {
          const file = mediaFiles[index];
          const mediaType = file ? getMediaType(file.originalname) : null;
          const mediaUrl = file ? await uploadFileToFirebase(file) : null;
  
          return {
            content: paragraph.content,
            media: {
              images: mediaType === "image" ? mediaUrl : null,
              videos: mediaType === "video" ? mediaUrl : null,
            },
          };
        }));

        const newBlog = new Blog({
          title,
          thumbnail,
          paragraphs,
          author,
        });

        await newBlog.save();

        return res.json({message: "Blog created successfully"});
      } catch (error) {
        console.error("Error creating blog:", error);
        return res.status(500).json({error: "Error creating blog"});
      }
    },
);


// router to fetch public blogs
router.get("/publicblog",
    async (req, res) => {
      try {
        const approvedPublicBlogs = await Blog.find({approvalStatus: "approved", isPublic: true});

        const formattedBlogs = await Promise.all(approvedPublicBlogs.map(async (blog) => {
          const author = await User.findById(blog.author);

          const paragraphs = blog.paragraph.map((paragraph) => {
            return {
              content: paragraph.content,
              media: {
                images: paragraph.media.images ? `/${paragraph.media.images}` : null,
                videos: paragraph.media.videos ? `/${paragraph.media.videos}` : null,
              },
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

        return res.json({data: formattedBlogs});
      } catch (error) {
        console.error("Error fetching public blogs", error);
        return res.json({Error: "Error fetching public blogs"});
      }
    });


// router to fetch a particular blog
router.get("/fetch/:blogId",
    async (req, res) => {
      try {
        const blogId = req.params.blogId;

        const blog = await Blog.findById(blogId);

        if (!blog) {
          return res.status(404).json({error: "Blog not found"});
        }

        const author = await User.findById(blog.author, "userName");

        const formattedParagraphs = blog.paragraph.map((paragraph) => ({
          content: paragraph.content,
          media: {
            images: paragraph.media.images ? `/${paragraph.media.images}` : null,
            videos: paragraph.media.videos ? `/${paragraph.media.videos}` : null,
          },
        }));


        const formattedBlog = {
          blogId: blog._id,
          title: blog.title,
          thumbnail: blog.thumbnail ? `/${blog.thumbnail}` : null,
          paragraphs: formattedParagraphs,
          userName: author ? author.userName : "Unknown",
        };

        return res.json({data: formattedBlog});
      } catch (error) {
        console.error("Error fetching a particular blog:", error);
        return res.json({Error: "Error fetching a particular blog"});
      }
    });

module.exports = router;


