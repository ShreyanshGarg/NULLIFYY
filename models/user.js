const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");
const userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: String,
  username: String,
  password: String,
  phoneno: Number,
  friends: [
    {
      name: String,
      amount: Number,
    },
  ],
  transactions: [
    {
      name: String,
      amount: Number,
    },
  ],
  groupsId: []
});

userSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model("User", userSchema);
