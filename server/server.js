const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/todo-app');

let Todo = mongoose.model('Todo', {
    text: {
        type: String,
        required: true,
        minlength: 1,
        trim: true
    },
    completed: {
        type: Boolean,
        default: false
    },
    completedAt: {
        type: Number,
        default: null
    }
});

let User = mongoose.model('User', {
  email: {
    type: String,
    required: true,
    minlength: 1,
    trim: true
  }
})

// let newTodo = new Todo({
//     text: '  Another new todo  '
// });
//
// newTodo.save()
//     .then(
//         doc => console.log('Saved Todo: ', doc),
//         err => console.error(err)
//     );


// let user = new User({
//   email: 'kobus@gmail.com'
// })
//
// user.save()
//   .then(
//     doc => console.log(doc),
//     err => console.log(err)
//   );
