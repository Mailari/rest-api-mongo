/*
 * File: seed.js
 * Project: node-todo-api
 * Created: Tuesday, 5th March 2019 5:08:46 pm
 * Author: Mailari (mailari.hulihond@altorumleren.com)
 * Description: 
 * ----- it provides data required for testing the application to server/server.test.js
 * Last Modified: Tuesday, 5th March 2019 5:45:33 pm
 * Modified By: Mailari (mailari.hulihond@altorumleren.com)
 * -----
 * Copyright - 2019 Altorum leren pvt ltd
 */

const { ObjectId } = require('mongodb');
const jwt = require('jsonwebtoken');

const { Todo } = require('./../models/todo');
const { User } = require('./../models/user');

const userOneId = new ObjectId();
const userTwoId = new ObjectId();

const users = [{
    _id: userOneId,
    email: "abc@xyz.com",
    password: "Mypass123",
    tokens: [{
        access: 'auth',
        token: jwt.sign({ _id: userOneId, access: 'auth' }, process.env.JWT_SECRET).toString()
    }]
}, {
    _id: userTwoId,
    email: "abcdef@xyz.com",
    password: "Mypass",
    tokens: [{
        access: 'auth',
        token: jwt.sign({ _id: userTwoId, access: 'auth' }, process.env.JWT_SECRET).toString()
    }]
}];

const populateusers = (done) => {
    User.remove({}).then(() => {

        var userone = new User(users[0]).save();
        var usertwo = new User(users[1]).save();
        return Promise.all([userone, usertwo]).then(() => done());
    });
};

// creating todo for each test run
const todos = [{
    _id: new ObjectId(),
    text: 'first test todo',
    _creator: userOneId
}, {
    _id: new ObjectId(),
    text: 'second test todo',
    completed: true,
    completedAt: 333,
    _creator: userTwoId
}];

const populatetodos = (done) => {
    Todo.remove({}).then(() => {
        return Todo.insertMany(todos);
    }).then(() => done()).catch((e) => done(e));
};

module.exports = { todos, populatetodos, users, populateusers };
