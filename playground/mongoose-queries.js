
const { ObjectID } = require('mongodb');
const { mongoose } = require('./../server/db/mongoose');
const { Todo } = require('./../server/models/todo');
const { User } = require('./../server/models/user');

let todoId = '594984bb26c4ac6f78253415';
let userId = '5949673c738c634eff249517';

// if (!ObjectID.isValid(todoId)) {
//   console.log('ID is not valid.');
// }
//
// Todo.find({
//   _id: todoId
// }).then((todos) => {
//   console.log('Todos:', todos);
// });
//
// Todo.findOne({
//   _id: todoId
// }).then((todo) => {
//   console.log('Todo:', todo);
// })
//
// Todo.findById(todoId).then((todo) => {
//   console.log('Todo by Id:', todo);
// }).catch( e => console.error(e) )

User.findById(userId).then(
  (user) => {
    if (!user) {
      return console.error('User not found.');
    }

    console.log('User', user);
  },
  (e) => console.error(e)
)
