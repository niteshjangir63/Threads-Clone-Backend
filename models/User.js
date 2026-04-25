const mongoose = require("mongoose");

const userSchema = mongoose.Schema({

    name: {
        type: String,
        required: true
    },

    username: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },

    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    password: {
        type: String,
        required: true

    },
    profile: {
        type: String,
        default: ""
    },

    profilePublicId: {
        type: String,
        default: ""
    },
    bio: {
        type: String,
        default: "Hey there i'm new on thread",
    },
    followers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"

    }],
    following: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],
    posts: [{

        type: mongoose.Schema.Types.ObjectId,
        ref: "Post"
    }],
    isVerified: {
        type: Boolean,
        default: false
    }


}, { timestamps: true });


module.exports = mongoose.model("User", userSchema)