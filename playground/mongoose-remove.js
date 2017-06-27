const { ObjectID } = require('mongodb');

const { mongoose } = require('./../server/db/mongoose');
const { Todo } = require('./../server/models/todo');
const { User } = require('./../server/models/user');

// ***** removes all documents in a collection.

// Todo.remove({}).then(
//   result => console.log(result)
// )


// ***** Todo.findOneAndRemove. Returns doc that was removed. Can query by other properties.

// Todo.findOneAndRemove({
//   _id: '5952b6cbebd9ddafd3f8e9ea'
// }).then(todo => console.log(todo))

// ***** Todo.findByIdAndRemove. Returns doc that was removed.

// Todo.findByIdAndRemove('5952b6a1ebd9ddafd3f8e9e9').then(
//   todo => console.log(todo)
// )
