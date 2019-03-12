// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
  if (err) {
    return console.log('Unable to connect to MongoDB server');
  }
  console.log('Connected to MongoDB server');

  
  // deleteOne
  // db.collection('Todos').deleteOne({text: 'hello world'}).then((result) => {
  //   console.log(result);
  // });


  db.collection('Todos').findOneAndDelete({
          text  : 'hello world'
  }).then((results) => {
    console.log(JSON.stringify(results, undefined, 2));
  });

  db.close();
});
