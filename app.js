const express=require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser")
const app=express();





app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
  extended: true
}));


app.get("/",function(req,res){
  res.render("main.ejs");
})


app.listen(5000,function(){
  console.log("Server Started");
})
