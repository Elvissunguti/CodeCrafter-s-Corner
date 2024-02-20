const express = require("express");
const User = require("../Model/User");
const router = express.Router();
const bcrypt = require("bcrypt");
const { getToken } = require("../Utils/Helpers");

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

        return res.json({ message: "User created successfully"});

    } catch(error){
        console.error("Error signing up new account:", error);
        return res.json({ Error: "Error signing up new account"})
    }
});

module.exports = router;