const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: { 
        type: String,
        required: true,
        unique: true
    },
    pendingTasks: {
        type: [String],
        default: []
    },
    dateCreated: {
        type: Date
    }
});

module.exports = mongoose.model('User', UserSchema);
