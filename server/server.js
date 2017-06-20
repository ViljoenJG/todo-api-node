const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/todo-app');

let Todo = mongoose.model('Todo', {
    text: {
        type: String
    },
    completed: {
        type: Boolean
    },
    completedAt: {
        type: Number
    }
});

let newTodo = new Todo({
    text: 'Study some NodeJS',
    completed: true,
    completedAt: new Date().getTime()
});

newTodo.save()
    .then(
        doc => console.log('Saved Todo: ', doc),
        err => console.error(err)
    );