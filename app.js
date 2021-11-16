const express = require("express");
const session = require("express-session");
const passport = require("passport");
var url = require('url');
const passportLocalMongoose = require("passport-local-mongoose");
var cookieParser = require("cookie-parser");


const ejs = require("ejs");
const bodyParser = require("body-parser")
const mongoose = require("mongoose");
const app = express();

var m = false;

app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(cookieParser());
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: false
}))

app.use(passport.initialize());
app.use(passport.session());

mongoose.connect("mongodb://localhost:27017/profileDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

var msg = 0;

const userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: String,
  username: String,
  password: String,
  phoneno: Number,
  friends: [String]
});

userSchema.plugin(passportLocalMongoose);

const User = new mongoose.model('User', userSchema);

passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



app.get("/signup", function(req, res) {
  if (msg === 1) {
    res.render("signup.ejs", {
      danger1: "block",
      danger2: "none"
    });
    msg = 0;
  } else if (msg === 2) {
    res.render("signup", {
      danger1: "none",
      danger2: "block"
    });
    msg = 0;
  } else {
    res.render("signup.ejs", {
      danger1: "none",
      danger2: "none"
    });
  }
})

app.get("/", function(req, res) {
  if (msg === 0) {
    res.render("login.ejs", {
      danger: "none"
    });
  } else {
    msg = 0;
    res.render("login.ejs", {
      danger: "block"
    });
  }
})

app.get("/dashboard", function(req, res) {
  if (req.isAuthenticated()) {
    //     //req.user gives access to the info of authenticated user
    // var passedVariable = req.query.valid;
    // if(passedVariable=="shreyansh"){
    // console.log(passedVariable);
    // req.query.valid="tanmay";
    // passedVariable = req.query.valid
    // }
    // else{
    // console.log(passedVariable);
    // }

    var context = req.cookies["context"];
    res.clearCookie("context", {
      httpOnly: true
    });
    console.log(context);

    res.render("main", {
      firstname: req.user.firstName,
      lastname: req.user.lastName,
      friendList: req.user.friends,
      invite_warning:"block",
      error_msg:context
    });
  } else {
    // authentication fails
    res.render("login", {
      danger: "none"
    });
  }
})

app.get("/logout", function(req, res) {
  req.logout();
  res.redirect("/");
})

// ***********Signup request***************
app.post("/register", function(req, res) {
  User.findOne({
    email: req.body.email
  }, function(err, foundDuplicate) {
    if (err) {
      console.log(err);
    } else {
      if (foundDuplicate) {
        msg = 1;
        res.redirect("/signup");
      } else {
        User.register({
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          email: req.body.email,
          username: req.body.username,
          phoneno: req.body.phoneNo,
          friends: []
        }, req.body.password, function(err, user) {
          if (err) {
            console.log(err);
            // msg=1 for username already exists
            msg = 2;
            res.redirect("/signup");
          } else {
            console.log(user);
            passport.authenticate("local")(req, res, function() {
              res.redirect("/dashboard");
            });
          }
        });
      }
    }
  })
});

// **********Log In request********
app.post("/login", function(req, res, next) {

  passport.authenticate('local', function(err, user, info) {
    if (err) {
      return next(err);
    }
    if (!user) {
      msg = 1;
      return res.redirect('/');
    }
    req.logIn(user, function(err) {
      if (err) {
        return next(err);
      }
      return res.redirect("/dashboard");
    });
  })(req, res, next);
})


app.post("/main", function(req, res) {
  res.render("main.ejs");
})

app.post("/temp", function(req, res) {
  console.log(req.body.friends);
  res.render("main", {
    firstname: "shreyansh",
    lastname: "garg",
    friendList: ["titu", "golu"]
  });
})

app.post("/invite", function(req, res) {
  let error_message = "";
  User.findOne({
    username: req.body.invited_frnd
  }, function(err, result) {
    if (err) {
      console.log(err)
    } else {
      if (req.isAuthenticated()) {
        if (!result) {
          error_message = "user not found"
        } else {
          //own email enter event
          if (req.body.invited_frnd === req.user.username) {
            error_message = "cannot add own username";
          }
          // no user found with this username
          else {
            // already frnd exist in frnds array of user

            req.user.friends.forEach((item, i) => {
              if (item === req.body.invited_frnd) {
                error_message = "Already Exist";
                return;
              }
            });
            // if all goes right update the database
            if (error_message === "") {
              User.updateOne({
                _id: req.user._id
              }, {
                "$push": {
                  friends: req.body.invited_frnd
                }
              }, function(err) {
                if (err) {
                  console.log(err)
                }
              })
              User.updateOne({
                _id: result._id
              }, {
                "$push": {
                  friends: req.user.username
                }
              }, function(err) {
                if (err) {
                  console.log(err)
                }
              })
            }
          }
        }
        res.cookie("context", error_message, {
          httpOnly: true
        });
        res.redirect("/dashboard");

      } else {
        res.render("login", {
          danger: "none"
        });
      }
    }
  })


})


app.listen(3000, function() {
  console.log("Server Started on 3000");
})
