const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const functions = require("firebase-functions");
const path = require("path");
const passport = require("passport");
const JwtStrategy = require("passport-jwt").Strategy;
const {ExtractJwt} = require("passport-jwt");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const session = require("express-session");
const bodyParser = require("body-parser");
const User = require("./Backend/Model/User");
const AuthRoutes = require("./Backend/Routes/Auth");
const BlogRoutes = require("./Backend/Routes/Blog");
const AdminRoutes = require("./Backend/Routes/Admin");
const CommentRoutes = require("./Backend/Routes/Comments");
const MyBlogsRoutes = require("./Backend/Routes/MyBlogs");

const app = express();

const {uri: MONGODB_URI} = functions.config().mongodb;
const {
  client_id: GOOGLE_CLIENT_ID,
  client_secret: GOOGLE_CLIENT_SECRET,
} = functions.config().google;


mongoose.connect(
    MONGODB_URI,
    {useNewUrlParser: true, useUnifiedTopology: true},
).then(() => {
  console.log("Connected to MongoDB Atlas");
}).catch((err) => {
  console.log("Error connecting to MongoDB Atlas", err);
});

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cors({
  origin: [
    "https://codecrafter-s-corner.web.app/",
    "https://codecrafter-s-corner.firebaseapp.com/",
  ],
  credentials: true, // Make sure to include this if your frontend sends credentials
}))

app.use(session({
  secret: "SECRETKEY",
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    sameSite: "None",

    // Add other cookie options as needed
  },
}));

app.use(passport.initialize());
app.use(passport.session());

// Setup passport-jwt
const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = "SECRETKEY";

passport.use(
    new JwtStrategy(opts, (async (jwtPayload, done) => {
      try {
        const user = await User.findOne({_id: jwtPayload.identifier});
        if (user) {
          return done(null, user);
        }
        return done(null, false);
      } catch (err) {
        return done(err, false);
      }
    })),
);

// Google OAuth strategy
passport.use(new GoogleStrategy({
  clientID: GOOGLE_CLIENT_ID,
  clientSecret: GOOGLE_CLIENT_SECRET,
  callbackURL: "https://us-central1-codecrafter-s-corner.cloudfunctions.net/api/auth/google/callback",
}, async (accessToken, refreshToken, profile, done) => {
  try {
    let user = await User.findOne({googleId: profile.id});

    if (!user) {
      // If user doesn't exist, create a new user based on the Google profile
      user = new User({
        userName: profile.displayName,
        email: profile.emails[0].value,
        googleId: profile.id,
        // Add additional fields as needed
      });
      await user.save();
    } else {
      // Update user information if necessary
      user.email = profile.emails[0].value;
      // Update additional fields if needed
      await user.save();
    }

    return done(null, user);
  } catch (error) {
    return done(error);
  }
}));

// Serialize and deserialize user for sessions
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(err, user);
  });
});

app.use("/auth", AuthRoutes);
app.use("/blog", BlogRoutes);
app.use("/admin", AdminRoutes);
app.use("/comment", CommentRoutes);
app.use("/myblogs", MyBlogsRoutes);

exports.api = functions.https.onRequest(app);
