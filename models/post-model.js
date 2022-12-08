const mongoose = require('mongoose');


const postSchema = new mongoose.Schema({
    urId: {
        type: String,
        required: [true, ""]
    },
    postId: String,
    text: String,
    file: [],
    comments: [{
        urId: String,
        userName: String,
        text: String,
        time: Date,
        comId: String
    }],
    reactions: [],
    commentCount: {
        type: Number,
        default: 0
    },
    reactCount: {
        type: Number,
        default: 0,
    },

    createDate: Date


},
    {
        timestamps: true
    })

const PostModel = mongoose.model('posts', postSchema)
module.exports = PostModel