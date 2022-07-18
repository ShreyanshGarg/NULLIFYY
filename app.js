const express = require("express");
const bodyParser = require('body-parser');
const session = require("express-session");
const passport = require("passport");
const cookieParser = require("cookie-parser");
require("./db/db_connection");
const User = require("./models/user.js");
const app = express();

var m = false;

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(cookieParser());
app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());
var msg = 0;

passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.get("/signup", function (req, res) {
  if (msg === 1) {
    res.render("signup.ejs", {
      danger1: "block",
      danger2: "none",
    });
    msg = 0;
  } else if (msg === 2) {
    res.render("signup", {
      danger1: "none",
      danger2: "block",
    });
    msg = 0;
  } else {
    res.render("signup.ejs", {
      danger1: "none",
      danger2: "none",
    });
  }
});

app.get("/", function (req, res) {
  if (msg === 0) {
    res.render("login.ejs", {
      danger: "none",
    });
  } else {
    msg = 0;
    res.render("login.ejs", {
      danger: "block",
    });
  }
});

app.get("/dashboard", function (req, res) {
  if (req.isAuthenticated()) {
    var context = req.cookies["context"];
    res.clearCookie("context", {
      httpOnly: true,
    });

    res.render("main", {
      firstname: req.user.firstName,
      lastname: req.user.lastName,
      friendList: req.user.friends,
      error_msg: context,
      username: req.user.username,
      transactionList: req.user.transactions,
    });
  } else {
    // authentication fails
    res.render("login", {
      danger: "none",
    });
  }
});

app.get("/logout", function (req, res) {
  req.logout();
  // console.log("logged out");
  res.redirect("/");
});

// ***********Signup request***************
app.post("/register", function (req, res) {
  User.findOne(
    {
      email: req.body.email,
    },
    function (err, foundDuplicate) {
      if (err) {
        console.log(err);
      } else {
        if (foundDuplicate) {
          msg = 1;
          res.redirect("/signup");
        } else {
          User.register(
            {
              firstName: req.body.firstName,
              lastName: req.body.lastName,
              email: req.body.email,
              username: req.body.username,
              phoneno: req.body.phoneNo,
              friends: [],
              transactions: [],
            },
            req.body.password,
            function (err, user) {
              if (err) {
                console.log(err);
                // msg=1 for username already exists
                msg = 2;
                res.redirect("/signup");
              } else {
                // console.log(user);
                passport.authenticate("local")(req, res, function () {
                  res.redirect("/dashboard");
                });
              }
            }
          );
        }
      }
    }
  );
});

// **********Log In request********
app.post("/login", function (req, res, next) {
  passport.authenticate("local", function (err, user, info) {
    if (err) {
      return next(err);
    }
    if (!user) {
      msg = 1;
      return res.redirect("/");
    }
    req.logIn(user, function (err) {
      if (err) {
        return next(err);
      }
      return res.redirect("/dashboard");
    });
  })(req, res, next);
});

app.post("/main", function (req, res) {
  res.render("main.ejs");
});

app.post("/expCalc", async function (req, res) {
  // console.log(req.body);
  if (req.isAuthenticated()) {
    var amountTotal = 0;
    var friend_counter = 0;
    var friend_map = [];
    const bbb = req.body;
    // const keys = Object.keys(courses);
    for (const key in bbb) {
      if (bbb.hasOwnProperty(key)) {
        if (parseInt(` ${bbb[key]}`) >= 0) {
          friend_counter++;
          amountTotal += parseInt(` ${bbb[key]}`);
          friend_map.push(parseInt(` ${bbb[key]}`));
        }
      }
    }

    if (friend_counter == 2) {
      // single friend
      friend_map[0] -= amountTotal / 2;
      friend_map[1] -= amountTotal / 2;
      await User.update(
        { username: req.user.username, "friends.name": req.body.button },
        {
          $inc: {
            "friends.$.amount": friend_map[0],
          },
        }
      );
      await User.update(
        { username: req.body.button, "friends.name": req.user.username },
        {
          $inc: {
            "friends.$.amount": friend_map[1],
          },
        }
      );
    } else {
      // multiple friends

      let amount_array = new Array(friend_counter);
      
      // Friends array formation 
      let friends_array = new Array(friend_counter);
      let frnd_string = req.body.button;
      friends_array = frnd_string.split(","); 
      friends_array.unshift(req.user.username);

      console.log(friends_array)
      for (let i = 0; i < amount_array.length; i++) {
        amount_array[i] = new Array(friend_counter);
      }

      // Initializing amount array with zero 
      for (let i = 0; i < friend_counter; i++) {
        for (let j = 0; j < friend_counter; j++) {
            amount_array[i][j] = 0;
        }
    }

      // Main algo for calculating effective amount b/w diff users
      for (let i in friend_map) {
        // console.log(i);
        let divided_amount = friend_map[i] / friend_counter;
        // console.log(divided_amount)
        for (let j = 0; j < friend_counter; j++) {
          if (i == j) amount_array[i][j] = 0;

          if (i < j) amount_array[i][j] -= divided_amount;

          if (j < i) amount_array[j][i] += divided_amount;
        }
        
        console.log(amount_array);
      }
     
      // round of the amount to 2 decimal places 
      for (let i = 0; i < friend_counter; i++) {
        for (let j = 0; j < friend_counter; j++) {
            amount_array[i][j] = amount_array[i][j].toFixed(2) * 1;
        }
    }
    console.log(amount_array);
      console.log("group condition encountered");
    }
    res.redirect("/dashboard");
  } else {
    res.redirect("/");
  }
});

app.post("/invite", function (req, res) {
  let error_message = "";
  User.findOne(
    {
      username: req.body.invited_frnd,
    },
    function (err, result) {
      if (err) {
        console.log(err);
      } else {
        if (req.isAuthenticated()) {
          if (!result) {
            error_message = "user not found";
          } else {
            //own email enter event
            if (req.body.invited_frnd === req.user.username) {
              error_message = "cannot add own username";
            }
            // no user found with this username
            else {
              // already frnd exist in frnds array of user

              req.user.friends.forEach((item, i) => {
                if (item.name === req.body.invited_frnd) {
                  error_message = "Already Exist";
                  return;
                }
              });
              // if all goes right update the database
              if (error_message === "") {
                User.updateOne(
                  {
                    _id: req.user._id,
                  },
                  {
                    $push: {
                      friends: {
                        name: req.body.invited_frnd,
                        amount: 0,
                      },
                    },
                  },
                  function (err) {
                    if (err) {
                      console.log(err);
                    }
                  }
                );
                User.updateOne(
                  {
                    _id: result._id,
                  },
                  {
                    $push: {
                      friends: {
                        name: req.user.username,
                        amount: 0,
                      },
                    },
                  },
                  function (err) {
                    if (err) {
                      console.log(err);
                    }
                  }
                );
              }
            }
          }
          res.cookie("context", error_message, {
            httpOnly: true,
          });
          res.redirect("/dashboard");
        } else {
          res.render("login", {
            danger: "none",
          });
        }
      }
    }
  );
});

app.post("/settleCalc", async function (req, res) {
  if (req.isAuthenticated()) {
    await User.updateOne(
      {
        _id: req.user._id,
      },
      {
        $push: {
          transactions: {
            name: req.body.buttonSettle,
            amount: req.body.settleAmount * -1,
          },
        },
      }
    );
    await User.updateOne(
      {
        username: req.body.buttonSettle,
      },
      {
        $push: {
          transactions: {
            name: req.user.username,
            amount: req.body.settleAmount,
          },
        },
      }
    );

    res.redirect("/dashboard");
  } else {
    res.redirect("/");
  }
});

app.post("/transacSettle", async function (req, res) {
  if (req.isAuthenticated()) {
    let temp;
    if (req.body.accept) {
      temp = req.body.accept;
    } else {
      temp = req.body.reject;
    }
    let nameAndAmount = temp.split(",");
    console.log(nameAndAmount);

    // 1. Remove the instance from transaction array (user)
    await User.findByIdAndUpdate(
      req.user.id,
      {
        $pull: {
          transactions: { name: nameAndAmount[0], amount: nameAndAmount[1] },
        },
      },
      { safe: true, upsert: true },
    );

    //2. Remove the instance from transaction array (secondPerson)
    await User.findOneAndUpdate(
      { username: nameAndAmount[0] },
      {
        $pull: {
          transactions: {
            name: req.user.username,
            amount: nameAndAmount[1] * -1,
          },
        },
      },
      { safe: true, upsert: true },
    );

    if (req.body.accept) {
      //Update amount it friendSchema (user)
      User.update(
        { username: req.user.username, "friends.name": nameAndAmount[0] },
        {
          $inc: {
            "friends.$.amount": nameAndAmount[1] * -1,
          },
        },
        function (err) {
          if (err) console.log(err);
        }
      );

      //Update amount it friendSchema (secondPerson)
      await User.update(
        { username: nameAndAmount[0], "friends.name": req.user.username },
        {
          $inc: {
            "friends.$.amount": nameAndAmount[1],
          },
        }
      );
    }

    res.redirect("/dashboard");
  } else {
    res.redirect("/");
  }
});

app.listen(process.env.PORT, function () {
  console.log("Server Started on 3000");
});
