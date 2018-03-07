
'use strict';

const bodyParser = require('body-parser');
const express = require('express');
const app = express();
app.use(bodyParser.json());

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const {PORT, DATABASE_URL} = require('./config');
const {Blog} = require('./models');


// GET 
app.get('/blogPosts', (req, res) => {
  Blog
    .find()
    .then(blogs => {
      res.json({
        blogs: blogs.map(
          (blog) => blog.serialize())
      });
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ message: 'Internal server error' });
    });
});

//GET - by ID
app.get('/blogPosts/:id', (req, res) => {
  Blog
    .findById(req.params.id)
    .then(blog => res.json(blog.serialize()))
    .catch(err => {
      console.error(err);
      res.status(500).json({ message: 'Internal server error' });
    });
});


//Post
app.post('/blogPosts', (req, res) => {
  const requiredFields = ['title', 'content', 'author'];
  for (let i = 0; i < requiredFields.length; i++) {
    const field = requiredFields[i];
    if (!(field in req.body)) {
      const message = `Missing \`${field}\` in request body`;
      console.error(message);
      return res.status(400).send(message);
    }
  }

  Blog
    .create({
      title: req.body.title,
      content: req.body.content,
      author: req.body.author
    })
    .then(blog => res.status(201).json(blog.serialize()))
    .catch(err => {
      console.error(err);
      res.status(500).json({ message: 'Internal server error' });
    });
});

//PUT 
app.put('/blogPosts/:id', (req, res) => {
  if (!(req.params.id && req.body.id && req.params.id === req.body.id)) {
    const message = (
      `Request path id (${req.params.id}) and request body id ` +
      `(${req.body.id}) must match`);
    console.error(message);
    return res.status(400).json({ message: message });
  }

  const toUpdate = {};
  const updateableFields = ['title', 'content', 'author'];

  updateableFields.forEach(field => {
    if (field in req.body) {
      toUpdate[field] = req.body[field];
    }
  });

  Blog
    .findByIdAndUpdate(req.params.id, { $set: toUpdate })
    .then(blog => res.status(204).end())
    .catch(err => res.status(500).json({ message: 'Internal server error' }));
});


//DELETE
app.delete('/blogPosts/:id', (req, res) => {
  Restaurant
    .findByIdAndRemove(req.params.id)
    .then(restaurant => res.status(204).end())
    .catch(err => res.status(500).json({ message: 'Internal server error' }));
});


app.use('*', function (req, res) {
  res.status(404).json({ message: `Not Found ${process.env.PORT}` });
});


let server;

function runServer(databaseUrl, port=PORT) {
  return new Promise((resolve, reject) => {
    mongoose.connect(databaseUrl, (err,db) => {
      if (err) {
        return reject(err);
      }

      server = app.listen(port, () => {
        console.log(`Your app is listening on port ${port}`);
        console.log("connectionString is: " + databaseUrl);
        resolve();
      })
      .on('error', err => {
        mongoose.disconnect();
        reject(err);
      });
    });
  });
  console.log(process.env.PORT, databaseUrl);
}

function closeServer() {
  return mongoose.disconnect().then(() => {
    return new Promise((resolve, reject) => {
      console.log('Closing server');
      server.close(err => {
        if (err) {
          return reject(err);
        }
        resolve();
      });
    });
  });
}
if (require.main === module) {
  runServer(DATABASE_URL).catch(err => console.error(err));
};
