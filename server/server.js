const config = require('./config/config');

const express = require('express');
const bodyParser = require('body-parser');
const _ = require('lodash');

const { mongoose } = require('./db/mongoose');
const { ObjectID } = require('mongodb');
const { Todo } = require('./models/todo');
const { User } = require('./models/user');

let app = express();
const port = process.env.PORT;

// app.use((req, res, next) => {
//   const line = `${ req.method } ${ req.url }`;
//   log(line);
//
//   next();
// });

app.use(bodyParser.json());

app.post('/todos', (req, res) => {
  const {text, completed, completedAt} = req.body;

  let todo = new Todo({
    text,
    completed,
    completedAt
  });

  todo.save()
    .then(doc => {
      res.send(doc)
    })
    .catch(() => res.status(400).send())
});

app.get('/todos', (req, res) => {
  Todo.find()
    .then((data) => {
      res.send({ data })
    })
    .catch(() => res.status(400).send())
});

app.get('/todos/:id', (req, res) => {
  const { id } = req.params;

  if (!id || !ObjectID.isValid(id)) {
    return res.status(404).send();
  }

  Todo.findById(id)
    .then((data) => {
      if (!data) {
        return res.status(404).send();
      }

      res.send({ data });
    })
    .catch(() => res.status(400).send())
});

app.delete('/todos/:id', (req, res) => {
  const { id } = req.params;

  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }

  Todo.findByIdAndRemove(id)
    .then((data) => {
      if (!data) { return res.status(404).send(); }
      res.status(200).send({ data });
    })
    .catch(() => res.status(400).send())
})

app.patch('/todos/:id', (req, res) => {
  const { id } = req.params;
  let body = _.pick(req.body, ['text', 'completed']);

  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }

  if (_.isBoolean(body.completed) && body.completed) {
    body.completedAt = new Date().getTime()
  } else {
    body.completed = false;
    body.completedAt = null;
  }

  Todo.findByIdAndUpdate(id, { $set: body }, { new: true} )
    .then((data) => {
      if (!data) { return res.status(404).send(); }
      res.send({ data })
    })
    .catch(() => res.status(400).send())
})

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
