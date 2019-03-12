const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');

var id = '5c6d473e0d592271fd62c8ea';
Todo.find({
    _id:id
}).then((todos)=>{
    console.log('Todos ',todos);
});

// Todo.findOne({
//     _id:id
// }).then((todo)=>{
//     console.log('Todo ',(todo));
// });  

User.find({}).then((emails)=>{
    console.log(emails);  
}).catch((e)=>{
    console.log('Error :',e);
});

