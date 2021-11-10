const express = require("express");
const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");

const ejs = require("ejs");
const bodyParser = require("body-parser")
const mongoose = require("mongoose");
const app = express();

app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
  extended: true
}));

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
  if(msg===0){
  res.render("signup.ejs", {
    danger: "none"
  });
}
else{
  res.render("signup.ejs", {
    danger: "block"
  });
  msg=0;
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

app.post("/dashboard", function(req, res) {
// ***********Signup request***************

  if (req.body.button == "signup_page") {

// User.findOne({email:req.body.emailId},function(err,foundduplicate){
//   if(err){
//     console.log(err);
//   }
//   else{
//     //  If email id Already Exist
//     if(foundduplicate)
//     {
//       msg=1;
//       res.redirect("/signup")
//     }
//     else{
//       const user = new User({
//         firstName: req.body.firstName,
//         lastName: req.body.lastName,
//         email: req.body.emailId,
//         password: req.body.password,
//         phoneno: req.body.phoneNo,
//         friends: ["Titu","Golu"]
//       })
//       var friends =  ["Titu","Golu"];
//       user.save();
//       res.render("main", {
//         firstname: req.body.firstName,
//         lastname: req.body.lastName,
//         friendList: friends
//       });
//     }
//   }
// })

User.register({
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          username: req.body.emailId,
          phoneno: req.body.phoneNo,
          friends: []
},req.body.password,function(err,user){
    if(err){
      console.log(err);
    }console.log(user);        
    passport.authenticate("local")(req, res, function(){
            res.redirect("/");
        });
})

  }
  // **********Log In request********
   else {
    User.findOne({
      email: req.body.username
    }, function(err, foundUser) {
      if (err) {
        console.log(err);
      } else {
        if(foundUser){
        // If user is found
        if (foundUser.password === req.body.password) {
          res.render("main", {
            firstname: foundUser.firstName,
            lastname: foundUser.lastName,
            friendList: foundUser.friends
          });
        }
         else {
          msg = 1;
          res.redirect("/");
        }
      }
      else{
        msg = 1;
        res.redirect("/");

      }
    }
    })
  }
})

app.post("/main", function(req, res) {
  res.render("main.ejs");
})

app.post("/temp", function(req, res) {
  console.log(req.body.friends);
  res.render("main", {
    firstname: "shreyansh",
    lastname: "garg",
    friendList: ["titu","golu"]
  });
})
app.post("/invite", function(req, res) {
  console.log(req.body.invited_frnd);

User.findOne({email:req.body.invited_frnd},function(err,result){
  if(err){console.log(err)}
  else{

  }
})

  res.render("main", {
    firstname: "shreyansh",
    lastname: "garg",
    friendList: ["titu","golu"]
  });
})

// const dom = new JSDOM(``,{
//   url: "https://www.google.com"
// });
// dom.window.document.addEventListener("click",function(){
//   console.log("Button clicked");
// });

// app.use(express.static("public"));

app.listen(3000, function() {
  console.log("Server Started on 3000");
})
