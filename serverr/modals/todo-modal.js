const mongoose = require("mongoose");

const todoArray = new mongoose.Schema({
    activityName:{
        type: String,
        require: true
    },
    status:{
        type:String,
        required: true,
        default: "Pending"
    },
    bufferTime:{
        type:Number,
        require:true,
        default:0//"00:00:00"
    },
    StartTime:{
        type:Date,
        require:true
    }
})

const todoInfoSchema = new mongoose.Schema({
    username:{
        type: String,
        required: true
    },
    todoList:{
        type:Array,
        default:[]
    },
    currentOngoing:{
        type:String,
        default:""
    }
});

const todoInfo = mongoose.model("todoInfo",todoInfoSchema)

module.exports = todoInfo;