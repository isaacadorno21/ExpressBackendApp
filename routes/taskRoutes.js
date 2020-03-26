const express = require('express');
const taskModel = require('../models/task');
const app = express();

app.get('/tasks', async (req, res) => {
    const tasks = await taskModel.find({});
    res.send(tasks);
});

app.get('/tasks/:id', async (req, res) => {
    try {
        const task = await taskModel.findById(req.params.id);
        res.send(task);
    } catch (err) {
        res.status(404).send("No task found :(");
    }
});

app.post('/tasks', async (req, res) => {
    let today = new Date();
    req.body.dateCreated = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();

    const tasks = new taskModel(req.body);
    await tasks.save();
    res.send(tasks);
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
        res.send(task)
      } catch (err) {
        res.status(500).send("No task found :(");
    }
});

module.exports = app;