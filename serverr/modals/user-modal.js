const mongoose = require("mongoose");

const userInfoSchema = new mongoose.Schema({
    username:{
        type: String,
        required: true,
        unique: true
    },
    password:{
        type: String,
        required:true,
    }
});

const userInfo = mongoose.model("userInfo",userInfoSchema)

module.exports = userInfo;