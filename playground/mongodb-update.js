const { MongoClient, ObjectID } = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/todo-app', (err, db) => {
    if (err) {
        return console.log('Unable to connect to database');
    }

    // findOneAndUpdate
    // let filter = {
    //     _id: new ObjectID('59404ba0d637f9f6cefae9fa')
    // };
    //
    // let action = {
    //     $set: {
    //         completed: true
    //     }
    // };
    //
    // let options = {
    //     returnOriginal: false
    // };
    //
    // db.collection('Todos')
    //     .findOneAndUpdate(filter, action, options)
    //     .then(
    //         result => console.log('Result: %o', result),
    //         err => console.error('Error: %o', err)
    //     );

    // Update User
    let filter = {
        _id: new ObjectID('59493beca566210d6d423977')
    };

    let updateAction = {
        $inc: {
            age: -1
        },
        $set: {
            name: 'Kobus Viljoen'
        }
    };

    db.collection('Users')
        .findOneAndUpdate(filter, updateAction, {returnOriginal: false})
        .then(
            resp => console.log(JSON.stringify(resp.value, null, 2)),
            err => console.error(err)
        );

    db.close();
});