const expect = require('expect');
const request = require('supertest');
const { ObjectID } = require('mongodb');

const { app } = require('./../server');
const { Todo } = require('./../models/todo');

const todos = [{
  _id: new ObjectID(),
  text: 'First test todo'
}, {
  _id: new ObjectID(),
  text: 'Second test todo'
}];

beforeEach((done) => {
  Todo.remove({})
    .then(() => {
      return Todo.insertMany(todos);
    })
    .then(() => done())
});

describe('POST /todos', () => {
  it('Should add a new todo', (done) => {
    let text = 'Test todo text';

    request(app).post('/todos').send({ text })
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
    request(app).post('/todos').send()
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
    request(app)
      .get('/todos')
      .expect(200)
      .expect((res) => {
        expect(res.body.data.length).toBe(2);
      })
      .end(done)
  })
});

describe('GET /todos/:id', () => {
  it('Should get one todo by id', (done) => {
    const id = todos[0]._id.toHexString();

    request(app)
      .get(`/todos/${ id }`)
      .expect(200)
      .expect((res) => {
        const { data } = res.body;

        expect(data._id).toBe(id);
        expect(data.text).toBe('First test todo');
      })
      .end(done)
  });

  it('Should return 404 if todo is not found', (done) => {
    request(app)
      .get(`todos/${ new ObjectID().toHexString() }`)
      .expect(404)
      .end(done)
  });

  it('Should return 404 for invalid object ids', (done) => {
    request(app)
      .get('/todos/123')
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
      .expect(200)
      .expect((res) => {
        const { data } = res.body;

        expect(data._id).toBe(id);
        expect(data.text).toBe('Second test todo');
      })
      .end((err, res) => {
        if (err) { return done(err); }

        Todo.findById(id).then((todo) => {
          expect(todo).toNotExist();
          done();
        }).catch((err) => done(err))
      })
  })

  it('Should return 404 if todo is not found', (done) => {
      request(app)
        .delete(`/todos/${ new ObjectID().toHexString() }`)
        .expect(404)
        .end(done)
  })

  it('Should return 404 if object id is invalid', (done) => {
      request(app)
        .delete('/todos/123abc')
        .expect(404)
        .end(done)
  })
})
