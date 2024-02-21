const express = require("express");
const mongoose = require("mongoose");
const http = require("http");
const cors = require("cors");
const path = require("path");
const passport = require("passport");
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const User = require("./src/Backend/Model/User");
const AuthRoutes = require("./src/Backend/Routes/Auth");
const BlogRoutes = require("./src/Backend/Routes/Blog");

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 8080;

mongoose.connect(
    "mongodb://CodeCrafter:CodeCrafter@ac-lunyvqa-shard-00-00.yqg0mk7.mongodb.net:27017,ac-lunyvqa-shard-00-01.yqg0mk7.mongodb.net:27017,ac-lunyvqa-shard-00-02.yqg0mk7.mongodb.net:27017/CodeCrafter?ssl=true&replicaSet=atlas-1gyjin-shard-0&authSource=admin&retryWrites=true&w=majority",
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

server.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
  });