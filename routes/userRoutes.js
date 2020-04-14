const express = require('express');
const userModel = require('../models/user');
const taskModel = require('../models/task');
const app = express();

app.get('/api/users', async (req, res) => {
    try {
        let find_val = {};
        let sort_val = {};
        let select_val = {};
        let lim = 0;
        let skip = 0;
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
                    skip = JSON.parse(req.query.skip);
                    break;
                case "limit":
                    lim = JSON.parse(req.query.limit);
                    break;
                case "count":
                    count = JSON.parse(req.query.count);
                    break;
                default:
                    console.log("invalid query");
            }
        }

        let users = await userModel
        .find(find_val)
        .skip(skip)
        .limit(lim)
        .select(select_val)
        .sort(sort_val);
        //.countDocuments(count)

        json_obj = {
            "message" : "OK",
            "data" : users
        };
        res.status(200).send(json_obj);
    } catch (err) {
        json_obj = {
            "message" : "Error occured :(",
            "data" : []
        };
        res.status(500).send(json_obj);
    }
});

app.get('/api/users/:id', async (req, res) => {
    try {
        const user = await userModel.findById(req.params.id);
        json_obj = {
            "message" : "OK",
            "data" : user
        };
        res.status(200).send(json_obj);
    } catch (err) {
        json_obj = {
            "message" : "No user found :(",
            "data" : []
        };
        res.status(404).send(json_obj);
    }
});

app.post('/api/users', async (req, res) => {
    try {
        let today = new Date();
        req.body.dateCreated = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
        const user = new userModel(req.body);
        await user.save();
        json_obj = {
            "message" : "OK",
            "data" : user
        };

        //If pending tasks found...

        res.status(201).send(json_obj);
    } catch (err) {
        json_obj = {
            "message" : "Unable to POST user :(",
            "data" : []
        };
        res.status(500).send(json_obj);    }
});

app.delete('/api/users/:id', async (req, res) => {
    try {
        const user = await userModel.findByIdAndDelete(req.params.id);
        
        //Update user if task includes an assignedUser
        let taskArr = user.pendingTasks;
        for (i = 0; i < taskArr.length; i++) { 
            let task = await taskModel.findById(taskArr[i]);
            task.assignedUser = "";
            task.assignedUserName = "unassigned";
            await task.save();
        }

        res.status(200).send();
      } catch (err) {
        json_obj = {
            "message" : "No user found :(",
            "data" : []
        };
        res.status(404).send(json_obj);
    }
});

app.put('/api/users/:id', async (req, res) => {
    try {
        await userModel.findByIdAndUpdate(req.params.id, req.body)
        await userModel.save()
        json_obj = {
            "message" : "OK",
            "data" : user
        };
        res.status(201).send(json_obj);
      } catch (err) {
        json_obj = {
            "message" : "No user found :(",
            "data" : []
        };
        res.status(404).send(json_obj);
    }
});

module.exports = app;