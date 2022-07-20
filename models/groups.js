const mongoose = require('mongoose');
const passportLocalMongoose = require("passport-local-mongoose");
const groupSchema = new mongoose.Schema({
    groupName: {
        type: String,
        unique: true    
    },
    transaction : [{
        person: String,
        amount: Number
    }],
    optimizeTransactions : [{
        sender: String,
        receiver: String,
        amount: Number
    }],
    personUsername : []
});

groupSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model("Group", groupSchema);