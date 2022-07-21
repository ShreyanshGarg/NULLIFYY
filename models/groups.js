const mongoose = require('mongoose');
const passportLocalMongoose = require("passport-local-mongoose");
const groupSchema = new mongoose.Schema({
    groupName: {
        type: String,
        unique: true    
    },
    username:String,
    transaction : [{
        person: String,
        amount: Number
    }],
    optimizeTransactions : [],
    personUsername : []
});

groupSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model("Group", groupSchema);