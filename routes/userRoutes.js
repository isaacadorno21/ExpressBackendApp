const express = require('express');
const userModel = require('../models/user');
const app = express();

app.get('/users', async (req, res) => {
    const users = await userModel.find({});
    res.send(users);
});

app.get('/users/:id', async (req, res) => {
    try {
        const user = await userModel.findById(req.params.id);
        res.send(user);
    } catch (err) {
        res.status(404).send("No user found :(");
    }
});

app.post('/users', async (req, res) => {
    let today = new Date();
    req.body.dateCreated = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();

    const users = new userModel(req.body);
    await users.save();
    res.send(users);
});

app.delete('/users/:id', async (req, res) => {
    try {
        await userModel.findByIdAndDelete(req.params.id);
        res.status(200).send();
      } catch (err) {
        res.status(404).send("No user found :(");
    }
});

app.put('/users/:id', async (req, res) => {
    try {
        await userModel.findByIdAndUpdate(req.params.id, req.body)
        await userModel.save()
        res.send(user)
      } catch (err) {
        res.status(500).send("No user found :(");
    }
});

module.exports = app;