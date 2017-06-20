const { MongoClient, ObjectID } = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/todo-app', (err, db) => {
    if (err) {
        return console.log('Unable to connect to database');
    }

    // deleteMany
    // db.collection('Todos')
    //     .deleteMany({text: 'Eat lunch'})
    //     .then((result) => {
    //         console.log(`Deleted: ${result.result.n}`)
    //     }, (err) => {
    //         console.log('An error occurred', err)
    //     });

    // deleteOne
    // db.collection('Todos')
    //     .deleteOne({text: 'Eat lunch'})
    //     .then(
    //         res => console.log(JSON.stringify(res.result, undefined, 2)),
    //         err => console.log('An error occurred', err)
    //     );

    // findOneAndDelete
    // db.collection('Todos')
    //     .findOneAndDelete({completed: false})
    //     .then(
    //         res => console.log(res),
    //         err => console.log('An error occurred', err)
    //     );

    // find by id and delete
    // db.collection('Users')
    //     .findOneAndDelete({_id: new ObjectID('594039cca627df50dcc881af')})
    //     .then(
    //         res => console.log(res),
    //         err => console.log(err)
    //     );

    // db.collection('Users')
    //     .deleteMany({ name: 'Kobus' })
    //     .then(
    //         res => console.log(res.result),
    //         err => console.log(err)
    //     );

    db.close();
});