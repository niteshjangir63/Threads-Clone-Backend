const mongoose = require("mongoose");

const commentSchema = mongoose.Schema({

    content:{
        type:String,
        required:true,
        trim:true
    },
    userId:{

        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    
    postId:{

        type:mongoose.Schema.Types.ObjectId,
        ref:"Post",
        required:true,
    },
    likes:
        {
            type:Number,
            default:0
        }
    ,
    replies:{

        type:mongoose.Schema.Types.ObjectId,
        ref:"Comment",
        default:null

    }
    

},{timestamps:true});

module.exports = mongoose.model("Comment",commentSchema);