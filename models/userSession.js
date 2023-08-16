const mongoose = require('mongoose');

const userSession = new mongoose.Schema({
    session_id: {
        type: mongoose.Types.ObjectId,
        required: true,
        unique: true,
        default: () => new mongoose.Types.ObjectId()
    },
    user_id: {
        type: mongoose.Types.ObjectId,
        ref: 'users',
        required: true
    },
    access_token: {
        type: String,
        required: false
    },
    login_at: {
        type: Date,
        default: Date.now(),
        required: false
    },
    logout_at: {
        type: Date,
        required: false
    }

})

const UserSession = mongoose.model('user_session', userSession)
module.exports = UserSession;