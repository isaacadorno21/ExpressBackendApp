const express = require('express');
const userModel = require('../models/user');
const app = express();

app.get('api/users', async (req, res) => {
    try {
        const users = await userModel.find({});
        json_obj = {
            "message" : "OK",
            "data" : users
        };
        res.status(200).send(json_obj);
    } catch (err) {
        res.status(500).send("Error occured :(");
    }
});

app.get('api/users/:id', async (req, res) => {
    try {
        const user = await userModel.findById(req.params.id);
        json_obj = {
            "message" : "OK",
            "data" : user
        };
        res.status(200).send(json_obj);
    } catch (err) {
        res.status(404).send("No user found :(");
    }
});

app.post('api/users', async (req, res) => {
    try {
        let today = new Date();
        req.body.dateCreated = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
        const user = new userModel(req.body);
        await user.save();
        json_obj = {
            "message" : "OK",
            "data" : user
        };
        res.status(201).send(json_obj);
    } catch (err) {
        res.status(500).send("Unable to POST user :(");
    }
});

app.delete('api/users/:id', async (req, res) => {
    try {
        await userModel.findByIdAndDelete(req.params.id);
        res.status(200).send();
      } catch (err) {
        res.status(404).send("No user found :(");
    }
});

app.put('api/users/:id', async (req, res) => {
    try {
        await userModel.findByIdAndUpdate(req.params.id, req.body)
        await userModel.save()
        json_obj = {
            "message" : "OK",
            "data" : user
        };
        res.status(201).send(json_obj);
      } catch (err) {
        res.status(404).send("No user found :(");
    }
});

module.exports = app;