const express = require('express');
const taskModel = require('../models/task');
const userModel = require('../models/user');
const app = express();

app.get('/api/tasks', async (req, res) => {
    try {
        let find_val = {};
        let sort_val = {};
        let select_val = {};
        let lim = 0;
        let skip_val = 0;
        let count = false;

        for (cur_req in req.query) {
            switch(cur_req) {
                case "where":
                    find_val = JSON.parse(req.query.where);
                    break;
                case "sort":
                    sort_val = JSON.parse(req.query.sort);
                    break;
                case "select":
                    select_val = JSON.parse(req.query.select);
                    break;
                case "skip":
                    skip_val = JSON.parse(req.query.skip);
                    break;
                case "limit":
                    lim = JSON.parse(req.query.limit);
                    break;
                case "count":
                    count = JSON.parse(req.query.count);
                    break;
                default:
                    console.log("Query does not match specified GET requests (where, sort, etc...)");
            }
        }

        //there's probably a better way to do this, but not sure how to with await....
        let tasks = {};
 
        if (count == true) {
            //tasks = await taskModel.countDocuments(true, {limit : lim, skip : skip_val});
            tasks = await taskModel.countDocuments(true);
        }
        else {
            tasks = await taskModel
            .find(find_val)
            .skip(skip_val)
            .limit(lim)
            .select(select_val)
            .sort(sort_val);
        }

        json_obj = {
            "message" : "OK",
            "data" : tasks
        };
        res.status(200).send(json_obj);
    } catch (err) {
        json_obj = {
            "message" : "Error occured during GET request :(",
            "data" : []
        };
        res.status(500).send(json_obj);
    }
});

app.get('/api/tasks/:id', async (req, res) => {
    try {
        const task = await taskModel.findById(req.params.id);
        json_obj = {
            "message" : "OK",
            "data" : task
        };
        res.status(200).send(json_obj);
    } catch (err) {
        json_obj = {
            "message" : "No task found :(",
            "data" : []
        };
        res.status(404).send(json_obj);
    }
});

app.post('/api/tasks', async (req, res) => {
    try {
        let today = new Date();
        req.body.dateCreated = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
        const task = new taskModel(req.body);
        await task.save();

        //Update user if task includes an assignedUser
        const userID = task.assignedUser;
        if (userID !== null && userID != "") {
            const user = await userModel.findById(userID);
            if (user !== null) {
                if (user.pendingTasks.includes(task.id) == false) {
                    user.pendingTasks.push(task.id);
                }
                await user.save();    
            }
        }

        json_obj = {
            "message" : "OK",
            "data" : task
        };
        res.status(201).send(json_obj);
    } catch (err) {
        console.log(err);
        json_obj = {
            "message" : "Unable to POST task :(",
            "data" : []
        };
        res.status(500).send(json_obj);
    }
});

app.delete('/api/tasks/:id', async (req, res) => {
    try {
        const task = await taskModel.findByIdAndDelete(req.params.id);

        //Update user if task includes an assignedUser
        const userID = task.assignedUser;
        if (userID !== null && userID !== "") {
            let user = await userModel.findById(userID);
            if (user.pendingTasks.includes(task.id) == true) {
                user.pendingTasks = user.pendingTasks.filter(function(value){ return value != task.id;});
            }
            await user.save();
        }

        res.status(200).send();
      } catch (err) {
        json_obj = {
            "message" : "No task found :(",
            "data" : []
        };
        res.status(404).send(json_obj);
    }
});

app.put('/api/tasks/:id', async (req, res) => {
    try {
        const task = await taskModel.findByIdAndUpdate(req.params.id, req.body)
        json_obj = {
            "message" : "OK",
            "data" : []
        };
        res.status(201).send(json_obj);
      } catch (err) {
        json_obj = {
            "message" : "No task found :(",
            "data" : []
        };
        res.status(404).send(json_obj);
    }
});

module.exports = app;