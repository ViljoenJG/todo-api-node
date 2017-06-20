const { MongoClient, ObjectID } = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/todo-app', (err, db) => {
    if (err) {
        return console.log('Unable to connect to database');
    }

    // findOneAndUpdate

    db.close();
});