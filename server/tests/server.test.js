const expect = require('expect');
const request = require('supertest');
const { ObjectID } = require('mongodb');

const { app } = require('./../server');
const { Todo } = require('./../models/todo');
const { User } = require('./../models/user');
const { todos, populateTodos, users, populateUsers } = require('./seed/seed');

beforeEach(populateUsers);
beforeEach(populateTodos);

/**
*  Todo Routes tests
*/

describe('POST /todos', () => {
  it('Should add a new todo', (done) => {
    let text = 'Test todo text';

    request(app).post('/todos')
      .set('x-auth', users[0].tokens[0].token)
      .send({ text })
      .expect(200)
      .expect((res) => {
        expect(res.body.text).toBe(text);
      })
      .end((err, res) => {
        if (err) return done(err);

        Todo.find({text})
          .then((todos) => {
            expect(todos.length).toBe(1);
            expect(todos[0].text).toBe(text);
            done()
          })
          .catch(err => done(err))
      })
  });

  it('Should not create todo with invalid body', (done) => {
    request(app).post('/todos')
      .set('x-auth', users[0].tokens[0].token)
      .send()
      .expect(400)
      .end((err, res) => {
        if (err) return done(err);

        Todo.find()
          .then(todos => {
            expect(todos.length).toBe(2);
            done()
          })
          .catch(err => done(err))
      })
  })
});

describe('GET /todos', () => {
  it('Should get all todos', (done) => {
    request(app).get('/todos')
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .expect((res) => {
        expect(res.body.data.length).toBe(1);
      })
      .end(done)
  })
});

describe('GET /todos/:id', () => {

  it('Should get one todo by id', (done) => {
    const id = todos[0]._id.toHexString();

    request(app)
      .get(`/todos/${ id }`)
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .expect((res) => {
        const { _id, text } = res.body.data;

        expect(_id).toBe(id);
        expect(text).toBe('First test todo');
      })
      .end(done)
  });

  it('Should not get a todo created by someone else', (done) => {
    const id = todos[0]._id.toHexString();

    request(app)
      .get(`/todos/${ id }`)
      .set('x-auth', users[1].tokens[0].token)
      .expect(404)
      .end(done)
  });

  it('Should return 404 if todo is not found', (done) => {
    request(app)
      .get(`todos/${ new ObjectID().toHexString() }`)
      .set('x-auth', users[0].tokens[0].token)
      .expect(404)
      .end(done)
  });

  it('Should return 404 for invalid object ids', (done) => {
    request(app)
      .get('/todos/123')
      .set('x-auth', users[0].tokens[0].token)
      .expect(404)
      .expect((res) => {
        expect(res.body.data).toBe(undefined)
      })
      .end(done)
  });
});

describe('DELETE /todos/:id', () => {
  it('Should delete object by id', (done) => {
    const id = todos[1]._id.toHexString();

    request(app)
      .delete(`/todos/${ id }`)
      .set('x-auth', users[1].tokens[0].token)
      .expect(200)
      .expect((res) => {
        const { _id, text } = res.body.data;

        expect(_id).toBe(id);
        expect(text).toBe('Second test todo');
      })
      .end((err, res) => {
        if (err) { return done(err); }

        Todo.findById(id).then((todo) => {
          expect(todo).toNotExist();
          done();
        }).catch((err) => done(err))
      })
  })

  it('Should not delete todo created by someone else', (done) => {
    const id = todos[1]._id.toHexString();

    request(app)
      .delete(`/todos/${ id }`)
      .set('x-auth', users[0].tokens[0].token)
      .expect(404)
      .end((err, res) => {
        if (err) { return done(err); }

        Todo.findById(id).then((todo) => {
          expect(todo).toExist();
          done();
        }).catch((err) => done(err))
      })
  })

  it('Should return 404 if todo is not found', (done) => {
      request(app)
        .delete(`/todos/${ new ObjectID().toHexString() }`)
        .set('x-auth', users[1].tokens[0].token)
        .expect(404)
        .end(done)
  })

  it('Should return 404 if object id is invalid', (done) => {
      request(app)
        .delete('/todos/123abc')
        .set('x-auth', users[1].tokens[0].token)
        .expect(404)
        .end(done)
  })
})

describe('PATCH /todos/:id', () => {
  it('should update a todo', (done) => {
    const id = todos[0]._id.toHexString();
    const newText = 'New text after update'

    request(app)
      .patch(`/todos/${ id }`)
      .set('x-auth', users[0].tokens[0].token)
      .send({
        completed: true,
        text: newText
      })
      .expect(200)
      .expect((res) => {
        const { text, completed, completedAt } = res.body.data;

        expect(text).toBeA('string').toBe(newText);
        expect(completed).toBeA('boolean').toBe(true);
        expect(completedAt).toBeA('number');
      })
      .end(done)
  })

  it('should not update a todo created by someone else', (done) => {
    const id = todos[1]._id.toHexString();
    const newText = 'New text after update'

    request(app)
      .patch(`/todos/${ id }`)
      .set('x-auth', users[0].tokens[0].token)
      .send({
        completed: true,
        text: newText
      })
      .expect(404)
      .end(done)
  })

  it('should clear completedAt when todo is not completed', (done) => {
    const id = todos[1]._id.toHexString();
    const newText = 'Another todo updated by the tests'

    request(app)
      .patch(`/todos/${ id }`)
      .set('x-auth', users[1].tokens[0].token)
      .send({
        text: newText,
        completed: false
      })
      .expect(200)
      .expect((res) => {
        const { text, completed, completedAt } = res.body.data;

        expect(text).toBeA('string').toBe(newText);
        expect(completed).toBeA('boolean').toBe(false);
        expect(completedAt).toNotExist();
      })
      .end(done)
  })
})

/**
*  User Routes tests
*/

describe('GET /users/me', () => {
  it('should return user if authenticated', (done) => {
    request(app)
      .get('/users/me')
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .expect((res) => {
        expect(res.body.id).toBe(users[0]._id.toHexString());
        expect(res.body.email).toBe(users[0].email);
      })
      .end(done)
  })

  it('should return 401 if not authenticated', (done) => {
    request(app)
      .get('/users/me')
      .expect(401)
      .expect((res) => {
        expect(res.body).toEqual({});
      })
      .end(done)
  })
})

describe('POST /users', () => {
  it('should create a user', (done) => {
    let email = 'test3@example.com';
    let password = 'userThreePass';

    request(app)
      .post('/users')
      .send({ email, password })
      .expect(200)
      .expect((res) => {
        expect(res.headers['x-auth']).toExist();
        expect(res.body.id).toExist();
        expect(res.body.email).toBe(email);
      })
      .end((err) => {
        if (err) { return done(err) }

        User.findOne({email}).then((user) => {
          expect(user).toExist();
          expect(user.password).toNotBe(password);
          done();
        }).catch(e => done(e));
      });
  });

  it('should return validation error if email is invalid', (done) => {
    request(app)
      .post('/users')
      .send({
        email: 'notemail',
        password: 'validPassword'
      })
      .expect(400)
      .expect((res) => {
        expect(res.body).toEqual({})
      })
      .end(done)
  })

  it('should return validation error if password is invalid', (done) => {
    request(app)
      .post('/users')
      .send({
        email: 'valid@email.com',
        password: 'not'
      })
      .expect(400)
      .expect((res) => {
        expect(res.body).toEqual({})
      })
      .end(done)
  })

  it('should not create user if email is in use', (done) => {
    request(app)
      .post('/users')
      .send({
        email: users[0].email,
        password: 'someStrongPassword'
      })
      .expect(400)
      .end(done)
  })
});

describe('POST /users/login', () => {
  it('should log in user and return auth token', (done) => {
    request(app)
      .post('/users/login')
      .send({
        email: users[1].email,
        password: users[1].password
      })
      .expect(200)
      .expect((res) => {
        expect(res.headers['x-auth']).toExist();
      })
      .end((err, res) => {
        if (err) { return done(err) }

        User.findById(users[1]._id).then((user) => {
          expect(user.tokens[1]).toInclude({
            access: 'auth',
            token: res.headers['x-auth']
          });
          done();
        }).catch(e => done(e));
      });
  });

  it('should reject invalid login', (done) => {
    request(app)
      .post('/users/login')
      .send({
        email: users[1].email,
        password: 'wrongPassword'
      })
      .expect(401)
      .expect((res) => {
        expect(res.headers['x-auth']).toNotExist();
      })
      .end((err, res) => {
        if (err) { return done(err) }

        User.findById(users[1]._id).then((user) => {
          expect(user.tokens.length).toBe(1);
          done();
        }).catch(e => done(e));
      })
  })
});

describe('DELETE /users/me/token', () => {
  it('should remove token on logout.', (done) => {
    request(app)
      .delete('/users/me/token')
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .end((err, res) => {
        if (err) { return done(err) }

        User.findById(users[0]._id).then((user) => {
          expect(user.tokens.length).toBe(0);
          done();
        }).catch(e => done(e))
      })
  })
})
