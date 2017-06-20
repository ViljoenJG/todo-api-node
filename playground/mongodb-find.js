const { MongoClient, ObjectID } = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/todo-app', (err, db) => {
    if (err) {
        return console.log('Unable to connect to database');
    }

    console.log('Connected to Database Server');

    // db.collection('Todos')
    //     .find({_id: new ObjectID('594038fa74819350509270d7')})
    //     .toArray()
    //     .then(
    //         (docs) => console.log(JSON.stringify(docs, undefined, 2)),
    //         (err) => console.log(err)
    //     );

    // db.collection('Todos')
    //     .find()
    //     .count()
    //     .then(
    //         (count) => console.log(`Todos Count: ${ count }`),
    //         (err) => console.log(err)
    //     );

    db.collection('Users')
        .find({name: 'Kobus'})
        .toArray()
        .then(
            (docs) => console.log(JSON.stringify(docs, undefined, 2)),
            (err) => console.log(err)
        );

    db.close();
});