const express = require('express');
const bodyParser = require('body-parser');

const { mongoose } = require('./db/mongoose');
const { Todo } = require('./models/todo');
const { User } = require('./models/user');

let app = express();
const port = 3000;

app.use(bodyParser.json());

app.post('/todos', (req, res) => {
  const {text, completed, completedAt} = req.body;

  let todo = new Todo({
    text,
    completed,
    completedAt
  });

  todo.save().then(doc => {
    res.send(doc)
  }, (err) => {
    res.status(400).send(err)
  })
});

app.get('/todos', (req, res) => {
  Todo.find()
    .then((todos) => {
      res.send({ todos })
    }, (err) => {
      res.status(400).send(err)
    })
});

app.listen(port, () => {
  console.log(`Started on port: ${ port }`);
});

module.exports = {
  app
};