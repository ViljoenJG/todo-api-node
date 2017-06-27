const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

let db = {
  localhost: 'mongodb://localhost:27017/todo-app'
}

mongoose.connect(process.env.MONGODB_URI || db.localhost);

module.exports = { mongoose };
