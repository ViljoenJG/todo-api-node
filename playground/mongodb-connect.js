const { MongoClient, ObjectID } = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/todo-app', (err, db) => {
    if (err) {
        return console.log('Unable to connect to database');
    }

    console.log('Connected to Database Server');

    let user = {
        name: 'Kobus',
        age: 30,
        location: 'moon'
    };

    db.collection('Users').insertOne(user, (err, reslults) => {
        if (err) return console.log('Unable to insert user', err);
        console.log(reslults.ops[0]._id.getTimestamp())
    });

    db.close();
});