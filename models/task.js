const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: { 
        type: String
    },
    deadline: {
        type: Date,
        required: true
    },
    completed: {
        type: Boolean
    },
    assignedUser: {
        type: String,
        default: ""
    },
    assignedUserName: {
        type: String,
        default: "unassigned"
    },
    dateCreated: {
        type: Date
    }
});

module.exports = mongoose.model('Task', TaskSchema);
