const express = require('express');
const taskModel = require('../models/task');
const app = express();

app.get('/tasks', async (req, res) => {
    try {
        const tasks = await taskModel.find({});
        json_obj = {
            "message" : "OK",
            "data" : tasks
        };
        res.status(200).send(json_obj);
    } catch (err) {
        res.status(500).send("Error occured :(");
    }
});

app.get('/tasks/:id', async (req, res) => {
    try {
        const task = await taskModel.findById(req.params.id);
        json_obj = {
            "message" : "OK",
            "data" : task
        };
        res.status(200).send(json_obj);
    } catch (err) {
        res.status(404).send("No task found :(");
    }
});

app.post('/tasks', async (req, res) => {
    try {
        let today = new Date();
        req.body.dateCreated = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
        const task = new taskModel(req.body);
        await task.save();
        json_obj = {
            "message" : "OK",
            "data" : task
        };
        res.status(201).send(json_obj);
    } catch (err) {
        res.status(500).send("Unable to POST task :(");
    }
});

app.delete('/tasks/:id', async (req, res) => {
    try {
        await taskModel.findByIdAndDelete(req.params.id);
        res.status(200).send();
      } catch (err) {
        res.status(404).send("No task found :(");
    }
});

app.put('/tasks/:id', async (req, res) => {
    try {
        await taskModel.findByIdAndUpdate(req.params.id, req.body)
        await taskModel.save()
        json_obj = {
            "message" : "OK",
            "data" : task
        };
        res.status(201).send(json_obj);
      } catch (err) {
        res.status(404).send("No task found :(");
    }
});

module.exports = app;