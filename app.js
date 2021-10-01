

const express=require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser")
const app=express();


var msg=0;


app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
  extended: true
}));


app.get("/signup",function(req,res){
  res.render("signup.ejs");
})

app.get("/",function(req,res){
  if(msg===0){
  res.render("login.ejs",{danger:"none"});
}
  else{
    msg=0;
    res.render("login.ejs",{danger:"block"});
  }
  }
)

app.post("/dashboard",function(req,res){
if(req.body.button=="signup_page"){
  res.render("main");
}else{

  if(req.body.username=="titu"){
    if(req.body.password=="shreyansh"){
      res.render("main");
    }
    else{
      msg=1;
    res.redirect("/");

    }
  }else{
    msg=1;
    res.redirect("/");
  }
}
})

app.post("/main",function(req,res){
  res.render("main.ejs");
})


app.listen(3000,function(){
  console.log("Server Started on 3000");
})
