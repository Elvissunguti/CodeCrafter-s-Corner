const express = require("express");
const User = require("../Model/User");
const router = express.Router();
const bcrypt = require("bcrypt");
const { getToken } = require("../Utils/Helpers");
const passport = require("passport");

router.post("/signup", async (req, res) => {
    try{

        const { userName, email, passWord } = req.body;

        const existingUser = await User.findOne({ email });

        if(existingUser){
            return res.json({ Message: "User with this email already exists" });
        }

        const hashedPassword = await bcrypt.hash(passWord, 10);

        const user = new User({
            userName,
            email,
            passWord: hashedPassword,
        });

        await user.save();

        const token = await getToken(email, user);

        return res.json({ message: "User created successfully", token, userId: user._id });

    } catch(error){
        console.error("Error signing up new account:", error);
        return res.json({ Error: "Error signing up new account"})
    }
});

router.post("/login", async (req, res) => {
    try{

        // check if email exists
        const user = await User.findOne({email: req.body.email});

        // if user exist
        if(user){
            const passwordChecker = await bcrypt.compare(
                req.body.passWord,
                user.passWord
            );

            if(passwordChecker){
                // generate a Jwt token for authentification
                const token =await getToken(user.email, user)
                return res.json({ message: "User logged in successfully", token, userId: user._id });
            } else{
                return res.json({ message: "user password does not match"});
            }
        } else{
            return res.json({ message: "Email not found"});
        }
         
    } catch(error){
        console.error("Error signing in to the account:", error);
        return res.json({ Error: "Error signing in to the account" });
    }
});

router.get("/userId",
passport.authenticate("jwt", {session: false}),
async (req, res) => {
    try{
        const userId = req.user._id;

        return res.json({ data: userId });

    } catch(error){
        console.error("Error fetching userid", error);
        return res.json({ error: "Error fetching userId" });
    }
});

module.exports = router;