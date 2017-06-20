const express = require('express');
const bodyParser = require('body-parser');

const { mongoose } = require('./db/mongoose');
const { Todo } = require('./models/todo');
const { User } = require('./models/user');

let app = express();
const port = process.env.PORT || 3000;

app.use((req, res, next) => {
  const line = `${ req.method } ${ req.url }`;
  log(line);

  next();
});

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
  log(`Server is up on port ${ port }`)
});

module.exports = {
  app
};

function log(msg, level = 'info') {
    const now = new Date().toString();
    const line = `[${ level.toUpperCase() }] ${ now }: ${ msg }`;

    console.log(line);
}
