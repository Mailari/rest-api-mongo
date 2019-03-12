
/*
 * File: server.js
 * Project: node-todo-api
 * Created: Saturday, 2nd March 2019 9:52:09 am
 * Author: Mailari (mailari.hulihond@altorumleren.com)
 * Description: 
 * ----- this is main file for server application
 * Last Modified: Tuesday, 5th March 2019 9:29:30 am
 * Modified By: Mailari (mailari.hulihond@altorumleren.com)
 * -----
 * Copyright - 2019 Altorum leren pvt ltd
 */

require('./config/config');

const express = require('express');
const bodyParser = require('body-parser');
const { ObjectId } = require('mongodb');
const _ = require('lodash');

var { mongoose } = require('./db/mongoose');
var { Todo } = require('./models/todo');
var { User } = require('./models/user');
var { authenticate } = require('./middleware/authenticate');

// for creating express app 
var app = express();
const PORT = process.env.PORT;// assigning port 
module.exports = { app };
app.listen(PORT, () => {
    console.log(`PORT is on ${PORT}`);
});

app.use(bodyParser.json());


//################# USERS/ OPTIONS #####################

// varify existing user

app.get('/users/me', authenticate, (req, res) => {
    res.send(req.user);
});




app.get('/ping', (req, res) => {
    res.status(200).send('hello ');
});

// login section
app.post('/users/login', (req, res) => {
    var body = _.pick(req.body, ['email', 'password']);
    User.findByCredentials(body.email, body.password).then((user) => {
        user.generateAuthToken().then((token) => {
            res.header('x-auth', token).send({ user });
        });
    }).catch((e) => {
        res.status(400).send();
    });
});

// adding user 
app.post('/users', (req, res) => {
    var body = _.pick(req.body, ['email', 'password']);
    var user = new User(body);

    user.save().then(() => {
        return user.generateAuthToken().then((token) => {
            console.log('user inserted successfully');

            res.status(200).header('x-auth', token).json(token);
        });
    }).catch((e) => res.status(400).send(e));
});

// logout user

app.delete('/users/me/token', authenticate, (req, res) => {
    req.user.removeToken(req.token).then(() => {
        res.status(200).send();
    }).catch((e) => {
        res.status(400).send();
    });
});

//###########################TODOS/OPTIONS ################



// POST/request with Todo 
app.post('/todos', authenticate, (req, res) => {
    console.log(req.body);
    var todo = new Todo({
        text: req.body.text,
        _creator: req.user._id,
        completed: req.user.completed,
        completedAt: req.user.completedAt
    });

    todo.save().then((data) => {
        res.send(data);
    }, (e) => {
        res.status(400).send(e);
    });
});

//GET/ request with todos which returns all todos in collection Todo
app.get('/todos', authenticate, (req, res) => {
    Todo.find({
        _creator: req.user._id
    }).then((todos) => {
        res.send({ todos })
    }, (e) => {
        res.status(400).send(e);
    });
});
// GET/todos/id
app.get('/todos/:id', authenticate, (req, res) => {
    var id = req.params.id;
    //id is valid or not
    if (!ObjectId.isValid(id)) {
        return res.status(404).send();
    }
    // check for data existing data for id requested
    Todo.findOne({
        _creator: req.user._id,
        _id: id
    }).then((todo) => {
        if (!todo) {
            return res.status(404).send();//data not found
        }
        res.status(200).send({ todo });//data found
    }).catch((e) => {
        res.status(404).send('Error data not found');
    });
});

// DELETE request for deleting todo with id given
app.delete('/todos/:id', authenticate, (req, res) => {
    var id = req.params.id;
    if (!ObjectId.isValid(id)) {
        return res.status(404).send('iNVALID ID ');
    }
    Todo.findOneAndRemove({
        _creator: req.user._id,
        _id: id
    }).then((todo) => {
        if (!data) {
            return res.status(404).send('todo not found');
        }
        res.status(200).send({ todo });
    }).catch((e) => {
        res.status(404).send(e);
    });
});

// updating existing todo with pacth request with id
app.patch('/todos/:id', authenticate, (req, res) => {
    var id = req.params.id;
    var body = _.pick(req.body, ['text', 'completed']);

    if (!ObjectId.isValid(id)) {
        return res.status(404).send();
    }

    if (_.isBoolean(body.completed) && body.completed) {
        body.completedAt = new Date().getTime();
    } else {
        body.completed = false;
        body.completedAt = null;
    }

    Todo.findOneAndUpdate({
        _creator: req.user._id,
        _id: id
    }, { $set: body }, { new: true }).then((todo) => {
        if (!todo) {
            return res.status(404).send();
        }

        res.send({ todo });
    }).catch((e) => {
        res.status(400).send();
    })
});

