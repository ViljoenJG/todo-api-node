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

app.post('/todos', authenticate, (req, res) => {
  const { text, completed } = _.pick(req.body, ['text', 'completed']);

  let todo = new Todo({
    text,
    completed,
    _creator: req.user._id
  });

  todo.save()
    .then(doc => {
      res.send(doc)
    })
    .catch(() => res.status(400).send())
});

app.get('/todos', authenticate, (req, res) => {
  Todo.find({ _creator: req.user._id })
    .then((data) => res.send({ data }))
    .catch(() => res.status(400).send())
});

app.get('/todos/:id', authenticate, (req, res) => {
  const { id } = req.params;

  if (!id || !ObjectID.isValid(id)) {
    return res.status(404).send();
  }

  Todo.findOne({
    _id: id,
    _creator: req.user._id
  }).then((data) => {
    if (!data) {
      return res.status(404).send();
    }

    res.send({ data });
  }).catch(() => res.status(400).send())
});

app.delete('/todos/:id', authenticate, async (req, res) => {
  const { id } = req.params;

  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }

  try {
    const data = await Todo.findOneAndRemove({
      _id: id,
      _creator: req.user._id
    });

    if (!data) { return res.status(404).send(); }
    res.status(200).send({ data });
  } catch (e) {
    res.status(400).send()
  }
});

app.patch('/todos/:id', authenticate, (req, res) => {
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

  const filter = {
    _id: id,
    _creator: req.user._id
  };

  Todo.findOneAndUpdate(filter, { $set: body }, { new: true} )
    .then((data) => {
      if (!data) { return res.status(404).send(); }
      res.send({ data })
    })
    .catch(() => res.status(400).send())
});

/******************
*   Users Routes
*******************/

app.post('/users', async (req, res) => {
  const body = _.pick(req.body, ['email', 'password']);
  const user = new User(body);

  try {
    await user.save();
    const token = await user.generateAuthToken();
    res.header('x-auth', token).send(user)
  } catch (e) {
    res.status(400).send()
  }
})

app.get('/users/me', authenticate, (req, res) => {
  res.send(req.user);
})

app.post('/users/login', async (req, res) => {
  const { email, password } = _.pick(req.body, ['email', 'password']);

  try {
    const user = await User.findByCredentials(email, password);
    const token = await user.generateAuthToken();
    res.header('x-auth', token).send(user);
  } catch (e) {
    res.status(401).send();
  }
})

app.delete('/users/me/token', authenticate, async (req, res) => {
  try {
      await req.user.removeToken(req.token);
      res.status(200).send()
  } catch (e) {
    res.status(400).send()
  }
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
