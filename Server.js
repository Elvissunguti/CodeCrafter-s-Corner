const express = require("express");
const mongoose = require("mongoose");
const http = require("http");
const cors = require("cors");
const path = require("path");
const passport = require("passport");
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const session = require("express-session");
const User = require("./src/Backend/Model/User");
const AuthRoutes = require("./src/Backend/Routes/Auth");
const BlogRoutes = require("./src/Backend/Routes/Blog");
const AdminRoutes = require("./src/Backend/Routes/Admin");
const bodyParser = require("body-parser");
const CommentRoutes = require("./src/Backend/Routes/Comments");
const MyBlogsRoutes = require("./src/Backend/Routes/MyBlogs");
require("dotenv").config();


const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 8080;

mongoose.connect(
    process.env.MONGODB_URI,
    { useNewUrlParser: true, useUnifiedTopology: true }
).then(() => {
    console.log("Connected to MongoDB Atlas");
}).catch((err) => {
    console.log("Error connecting to MongoDB Atlas", err);
});

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors({
  origin: 'http://localhost:3000', // Change to your frontend origin
  credentials: true,
}));


app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: {
      httpOnly: true,
      sameSite: 'None',
      
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
  new JwtStrategy(opts, async function (jwt_payload, done) {
    try {
      const user = await User.findOne({ _id: jwt_payload.identifier });
      if (user) {
        return done(null, user);
      } else {
        return done(null, false);
      }
    } catch (err) {
      return done(err, false);
    }
  })
);


// Google OAuth strategy
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: "http://localhost:8080/auth/google/callback"
}, async (accessToken, refreshToken, profile, done) => {
  try {
    let user = await User.findOne({  googleId: profile.id });

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

server.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
  });