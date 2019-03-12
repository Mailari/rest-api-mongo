/*
 * File: server.test.js
 * Project: node-todo-api
 * Created: Monday, 4th March 2019 11:53:56 am
 * Author: Mailari (mailari.hulihond@altorumleren.com)
 * Description: 
 * ----- this file include test cases for server.js
 * Last Modified: Tuesday, 5th March 2019 9:29:04 am
 * Modified By: Mailari (mailari.hulihond@altorumleren.com)
 * -----
 * Copyright - 2019 Altorum leren pvt ltd
 */

const expect = require('expect');
const request = require('supertest');
const { ObjectId } = require('mongodb');

const { app } = require('./../server');
const { Todo } = require('./../models/todo');
const { User } = require('./../models/user');
const { todos, populatetodos, users, populateusers } = require('./seed');

// deleting existing todos content inserting new todo for each test run 
beforeEach(populatetodos);
beforeEach(populateusers);

describe('post / todos', () => {
    it('should create a new todo', (done) => {
        var text = 'test todo text';

        request(app)
            .post('/todos')
            .send({ text })
            .set('x-auth', users[0].tokens[0].token)
            .expect(200)
            .expect((res) => {
                expect(res.body.text).toBe(text);
            })
            .end((err, res) => {
                if (err) {
                    return done(err);
                }
                Todo.find({ text }).then((todos) => {
                    expect(todos.length).toBe(1);
                    expect(todos[0].text).toBe(text);
                    done();
                }).catch((e) => done(e));
            });
    });

    it('should not create a new todo', (done) => {
        request(app)
            .post('/todos')
            .send({})
            .set('x-auth', users[0].tokens[0].token)
            .expect(400)
            .end((err, res) => {
                if (err) {
                    return done(err);
                }
                Todo.find().then((todos) => {
                    expect(todos.length).toBe(2);
                    done();
                }).catch((e) => done(e));
            });
    });

});

describe('GET/todos', () => {
    it('should get all the notes', (done) => {
        request(app)
            .get('/todos')
            .set('x-auth', users[0].tokens[0].token)
            .expect(200)
            .expect((res) => {
                expect(res.body.todos.length).toBe(1);
            })
            .end(done);
    });
});

describe('GET/todos/:id', () => {
    it('should return todo doc', (done) => {
        request(app)
            .get(`/todos/${todos[0]._id.toHexString()}`)
            .set('x-auth', users[0].tokens[0].token)
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.text).toBe(todos[0].text);
            })
            .end(done);
    });

    it('should not  return todo doc', (done) => {
        request(app)
            .get(`/todos/${todos[1]._id.toHexString()}`)
            .set('x-auth', users[0].tokens[0].token)
            .expect(404)
            .end(done);
    });
    it('should return 404 for valid id but not in database ', (done) => {
        var id = new ObjectId().toHexString();
        request(app)
            .get(`/todos/${id}`)
            .set('x-auth', users[0].tokens[0].token)
            .expect(404)
            .end(done);
    });

    it('should return 404 for invalid id ', (done) => {
        request(app)
            .get(`/todos/1233`)
            .set('x-auth', users[0].tokens[0].token)
            .expect(404)
            .end(done);
    });
});






describe('DELETE/todos/:id', () => {

    it('should remove  a todo ', (done) => {
        var hexId = todos[1]._id.toHexString();

        request(app)
            .delete(`/todos/${hexId}`)
            .set('x-auth', users[1].tokens[0].token)
            .expect(404)
            .end((err, res) => {
                if (err) {
                    return done(err);
                }
                Todo.findById(hexId).then((todo) => {
                    expect(!todo);
                    done();
                }).catch((e) => done(e));
            });
    });

    it('should return 404 for todo not found ', (done) => {
        var id = new ObjectId().toHexString();
        request(app)
            .delete(`/todos/${id}`)
            .set('x-auth', users[0].tokens[0].token)
            .expect(404)
            .end(done);
    });
    it('should return 404 id is invalid ', (done) => {
        request(app)
            .delete(`/todos/1233`)
            .set('x-auth', users[0].tokens[0].token)
            .expect(404)
            .end(done);
    });
});





describe('PATCH/todos/:id', () => {
    it('shuold update existing todo', (done) => {
        var id = todos[0]._id.toHexString();
        var text = 'this should be in first tode';

        request(app)
            .patch(`/todos/${id}`)
            .send({
                completed: true,
                text
            })
            .set('x-auth', users[0].tokens[0].token)
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.text).toBe(text);
                expect(res.body.todo.completed).toBe(true);
                expect(res.body.todo.completedAt);
            })
            .end(done);
    });
    it('shuold not  update by un authorised user existing todo', (done) => {
        var id = todos[0]._id.toHexString();
        var text = 'this should be in first tode';

        request(app)
            .patch(`/todos/${id}`)
            .send({
                completed: true,
                text
            })
            .set('x-auth', users[1].tokens[0].token)
            .expect(404)
            .end(done);
    });

    it('shuold update completedAt as false todo', (done) => {
        var id = todos[0]._id.toHexString();
        var text = 'this should be in first tode';

        request(app)
            .patch(`/todos/${id}`)
            .send({
                completed: false,
                text
            })
            .set('x-auth', users[0].tokens[0].token)
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.text).toBe(text);
                expect(res.body.todo.completed).toBe(false);
                expect(res.body.todo.completedAt);
            })
            .end(done);
    });

});




describe('GET/user/me', () => {
    it('it should return user if authenticated', (done) => {
        request(app)
            .get('/users/me')
            .set('x-auth', users[0].tokens.token)
            .expect(200)
            .expect((res) => {
                expect(res.body._id).toBe(users[0]._id.toHexString());
                expect(res.body.email).toBe(users[0].email);
            })
            .end(done());
    });
    it('it should return 401 if not authenticated', (done) => {
        request(app)
            .get('/users/me')
            .set('x-auth', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1YzdlM2NhNDdlZDAwYjEzZjBkYWJkNzMiLCJhY2Nlc3MiOiJhdXRoIiwiaWF0IjoxNTUxNzc2OTMyfQ.dBL4wrCToTwTD9yYVUjYb4eBFxBJJGK1Xs40R41R55w')
            .expect(401)
            .end(done);
    });
});





describe('POST/users', () => {

    it('should create new user', (done) => {
        body = {
            email: 'abcde@xyz.com',
            password: 'userpassword'
        }
        request(app)
            .post('/users')
            .send(body)
            .expect(200)
            .expect((res) => {
                expect(res.header['x-auth']);
            })
            .end(done);
    });
    it('should not create user with invalid email', (done) => {
        body = {
            email: 'abcde.com',
            password: 'userpassword'
        }
        request(app)
            .post('/users')
            .send(body)
            .expect(400)
            .end(done);
    });
    it('should not create user if user already exist ', (done) => {
        body = {
            email: users[0].email,
            password: users[0].password
        }
        request(app)
            .post('/users')
            .send(body)
            .expect(400)
            .end(done);
    });
});



describe('POST/users/login', () => {
    it('it should login andauth token', (done) => {
        request(app)
            .post('/users/login')
            .send({
                email: users[0].email,
                password: users[0].password
            })
            .expect(200)
            .expect((res) => {
                expect(res.header['x-auth']).toExist();
            })
            .end((err, res) => {
                if (err) {
                    return done();
                }
                User.findById(users[0]._id).then((user) => {
                    expect(user.tokens[0]).toInclude({
                        access: 'auth',
                        token: res.header['x-auth']
                    });
                    done();
                }).catch((e) => done(e));
            });
    });
    it('should reject invalid login ', (done) => {
        request(app)
            .post('/users/login')
            .send({
                email: 'abc@hm.com',
                password: 'hello one'
            })
            .expect(400)
            .end(done);
    });
    it('should reject invalid password ', (done) => {
        request(app)
            .post('/users/login')
            .send({
                email: users[0].email,
                password: 'alloaloya'
            })
            .expect(400)
            .end(done);

    });
});






describe('DELETE/users/me/token', () => {
    it('it should delete token ', (done) => {
        request(app)
            .delete('/users/me/token')
            .set('x-auth', users[0].tokens[0].token)
            .expect(200)
            .end((err, res) => {
                if (err) {
                    return done(err);
                }
                User.findById(users[0]._id).then((user) => {
                    expect(user.tokens.length).toBe(0);
                    done();
                }).catch((e) => done(e));
            });
    });
});