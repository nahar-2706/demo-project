const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    post_id: {
        type: mongoose.Types.ObjectId,
        required: true,
        unique: true,
        default: () => new mongoose.Types.ObjectId()
    },
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: false,
    },
    created_by: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: 'users'
    },
    created_at: {
        type: Date,
        default: Date.now()
    }
})

const Posts = mongoose.model('Posts', postSchema);
module.exports = Posts