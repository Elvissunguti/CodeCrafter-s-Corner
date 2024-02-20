const mongoose = require("mongoose");

const User = new mongoose.Schema({
    userName: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    passWord: {
        type: String,
        required: true,
    },
    isAdmin: {
        type: Boolean,
        default: false // By default, users are not admins
    }

});

// Pre-save hook to set CodeCrafter as admin
UserSchema.pre('save', function(next) {
    if (this.userName === "CodeCrafter") {
        this.isAdmin = true;
    }
    next();
});

const UserModel = mongoose.model("User", User);

module.exports = UserModel;
