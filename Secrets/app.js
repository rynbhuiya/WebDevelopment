require("dotenv").config();
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');
const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const findOrCreate = require("mongoose-findorcreate");
//const encrypt = require('mongoose-encryption');
//const md5 = require('md5');
//const bcrypt = require('bcryptjs');
//const saltRounds = 10;
const port = 3000;

const app = express();

app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
  secret: "Our little secret.",
  resave: false,
  saveUninitialized: true
}))
app.use(passport.initialize())
app.use(passport.session())

/////// MongoDB Connection ///////
mongoose.connect("mongodb://localhost:27017/userDB")

const userSchema = new mongoose.Schema({
  email: String,
  password: String,
  googleId: String,
  secret: String
})

userSchema.plugin(passportLocalMongoose)
userSchema.plugin(findOrCreate)
const User = new mongoose.model("user", userSchema)
passport.use(User.createStrategy());

passport.serializeUser((user, done) => {
  done(null, user.id)
});
passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(err, user)
  })
});

passport.use(new GoogleStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/google/secrets"
  },
  function(accessToken, refreshToken, profile, cb) {
    console.log(profile);

    User.findOrCreate({ googleId: profile.id }, function (err, user) {
      return cb(err, user);
    });
  }
));
/////// Get Requests ///////
app.get("/", (req, res) => {
  res.render("home")
})

app.get("/auth/google", passport.authenticate('google', {
    scope: ['profile']
}));

app.get('/auth/google/secrets',
  passport.authenticate('google', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect secrets.
    res.redirect('/secrets');
  }
);

app.get("/login", (req, res) => {
  res.render("login")
})

app.get("/register", (req, res) => {
  res.render("register")
})

app.get("/secrets", (req, res) => {
  User.find({"secret": {$ne: null}}, (err, foundUsers) => {
    if (err) {
      console.log(err);
    }
    else {
      if (foundUsers) {
        res.render("secrets", {usersWithSecrets: foundUsers})
      }
    }
  })
})

app.get("/logout", (req, res) => {
  req.logout((err) => {
    if (!err) {
      res.redirect("/")
    }
  })
})

app.get("/submit", (req, res) => {
  if (req.isAuthenticated()) {
    res.render("submit")
  }
  else {
    res.redirect("/login")
  }
})
/////// Post Requests ///////
app.post("/register", (req, res) => {
  User.register({username: req.body.username}, req.body.password, (err, user) => {
    if (err) {
      console.log(err);
      res.redirect("/register")
    }
    else {
      passport.authenticate("local")(req, res, () => {
        res.redirect("/secrets")
      })
    }
  })
})

app.post("/login", (req, res) => {
  const user = new User({
    username: req.body.username,
    password: req.body.password
  })

  req.login(user, (err) => {
    if (err) {
      console.log(err);
    }
    else {
      passport.authenticate("local")(req, res, () => {
        res.redirect("/secrets")
      })
    }
  })
})

app.post("/submit", (req, res) => {
  const submittedSecret = req.body.secret

  User.findById(req.user.id, (err, foundUser) => {
    if (err) {
      console.log(err);
    }
    else {
      if (foundUser) {
        foundUser.secret = submittedSecret
        foundUser.save(() => {
          res.redirect("/secrets")
        })
      }
    }
  })
})

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
