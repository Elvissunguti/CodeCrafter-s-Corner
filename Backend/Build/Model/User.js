const mongoose = require('mongoose');

const User = new mongoose.Schema({
  userName: {
    type: String,
    required: true,
    unique: true
  },
  googleId: {
    type: String
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  passWord: {
    type: String

  },
  isAdmin: {
    type: Boolean,
    default: false // By default, users are not admins
  }

});

// Pre-save hook to ensure only CodeCrafter can make other users admin
User.pre('save', function (next, user) {
  // Check if the user is trying to update isAdmin field
  if (this.isModified('isAdmin') && user.userName !== 'CodeCrafter') {
    const err = new Error('Only CodeCrafter can make other users admin');
    return next(err);
  }
  next();
});

const UserModel = mongoose.model('User', User);

module.exports = UserModel;