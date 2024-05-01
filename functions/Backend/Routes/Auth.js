/* eslint-disable */
const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const passport = require("passport");
const {getToken} = require("../Utils/Helpers");
const User = require("../Model/User");

// Google OAuth login route
router.get(
    "/google",
    passport.authenticate("google", {scope: ["profile", "email"]}),
);

// Google OAuth callback route
router.get(
    "/google/callback",
    passport.authenticate("google", {failureRedirect: "/login"}),
    async (req, res) => {
      try {
        // Extract user information from Google authentication
        const {email, userName} = req.user;

        // Check if the user already exists in your database
        let user = await User.findOne({email});

        // If the user doesn't exist, create a new user without requiring a password
        if (!user) {
          user = new User({email, userName});
          await user.save();
        }

        const token = await getToken(email, user);

        res.cookie("token", token, { domain: "codecrafter-s-corner.firebaseapp.com", httpOnly: true });
        res.cookie("token", token, { domain: "codecrafter-s-corner.web.app", httpOnly: true });

        res.redirect("https://codecrafter-s-corner.web.app/Blog"); // Redirect to home page or send token in response
      } catch (error) {
        console.error("Error handling Google authentication:", error);
        res.status(500).json({error: "Error handling Google authentication"});
      }
    },
);

router.post("/signup", async (req, res) => {
  try {
    const {userName, email, passWord} = req.body;

    const existingUser = await User.findOne({email});

    if (existingUser) {
      return res.json({Message: "User with this email already exists"});
    }

    const hashedPassword = await bcrypt.hash(passWord, 10);

    const user = new User({
      userName,
      email,
      passWord: hashedPassword,
    });

    await user.save();

    const token = await getToken(email, user);

    return res.status(200).json({message: "User created successfully", token});
  } catch (error) {
    console.error("Error signing up new account:", error);
    return res.status(500).json({error: "Error signing up new account"});
  }
});

router.post("/login", async (req, res) => {
  try {
    const {email, passWord} = req.body;
    // check if email exists
    const user = await User.findOne({email});

    // if user exists
    if (user) {
      const passwordChecker = await bcrypt.compare(passWord, user.passWord);
      if (passwordChecker) {
        // generate a Jwt token for authentication
        const token = await getToken(email, user);

        // Send success response with token
        return res.status(200).json({success: true, token});
      }
      return res.status(401).json({message: "User password does not match"});
    }
    return res.status(404).json({message: "Email not found"});
  } catch (error) {
    console.error("Error signing in to the account:", error);
    return res.status(500).json({error: "Error signing in to the account"});
  }
});

router.get(
    "/userId",
    passport.authenticate("jwt", {session: false}),
    async (req, res) => {
      try {
        const userId = req.user._id;

        const user = await User.findById(userId);

        if (!user) {
          return res.status(404).json({error: "User not found"});
        }

        const {_id, isAdmin, userName} = user;

        console.log("logged in user", user);

        return res.json({data: {_id, isAdmin, userName}});
      } catch (error) {
        console.error("Error fetching userId", error);
        return res.status(500).json({error: "Error fetching userId"});
      }
    },
);

module.exports = router;
