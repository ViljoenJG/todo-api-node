const config = require('./config/config');

const express = require('express');
const bodyParser = require('body-parser');
const _ = require('lodash');

const { mongoose } = require('./db/mongoose');
const { ObjectID } = require('mongodb');
const { Todo } = require('./models/todo');
const { User } = require('./models/user');
const { authenticate } = require('./middleware/authenticate');
const env = process.env.NODE_ENV || 'development';

let app = express();
const port = process.env.PORT;

app.use(bodyParser.json());

app.use((req, res, next) => {
  if (env !== 'test') {
    const line = `${ req.method } ${ req.url }`;
    log(line);
  }

  next();
});

/******************
*   Todo Routes
*******************/

app.post('/todos', (req, res) => {
  const { text, completed } = _.pick(req.body, ['text', 'completed']);

  let todo = new Todo({
    text,
    completed
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
});

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
});

/******************
*   Todo Routes
*******************/

app.post('/users', (req, res) => {
  const body = _.pick(req.body, ['email', 'password']);
  const user = new User(body);

  user.save()
    .then(() => user.generateAuthToken())
    .then(token => res.header('x-auth', token).send(user))
    .catch(err => res.status(400).send());
})

app.get('/users/me', authenticate, (req, res) => {
  res.send(req.user);
})

app.post('/users/login', (req, res) => {
  const { email, password } = _.pick(req.body, ['email', 'password']);

  User.findByCredentials(email, password)
    .then((user) => {
      return user.generateAuthToken().then(token => {
        return res.header('x-auth', token).send(user)
      })
    })
    .catch(() => res.status(401).send())
})

app.delete('/users/me/token', authenticate, (req, res) => {
  req.user.removeToken(req.token)
    .then(() => res.status(200).send())
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
