const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: {
        type: String
    },
    email: { 
        type: String
    },
    pendingTasks: {
        type: [String]
    },
    dateCreated: {
        type: Date
    }
});

module.exports = mongoose.model('User', UserSchema);
