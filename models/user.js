const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Types.ObjectId,
        required: true,
        unique: true,
        default: () => new mongoose.Types.ObjectId()
    },
    first_name: {
        type: String,
        required: true
    },
    last_name: {
        type: String,
        required: true
    },
    email_id: {
        type: String,
        required: true,
        unique: true
    },
    company_name: {
        type: String,
        required: true
    },
    db_url: {
        type: String,
        required: false
    },
    password: {
        type: String,
        required: true
    },
    created_at: {
        type: Date,
        default: Date.now()
    },
    profile_image: {
        type: String,
        default: null
    },

})
const Users = mongoose.model('users', userSchema)
module.exports = Users;