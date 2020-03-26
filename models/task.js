const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
    name: {
        type: String
    },
    description: { 
        type: String
    },
    deadline: {
        type: Date
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
