import express from 'express';
import {getItems, postItem, getItemById, mediaItems, putItem, deleteItem} from './media.js';
import {getUsers, getUserById, postUser, putUser, deleteUser} from './users.js';
const hostname = '127.0.0.1';
const port = 3000;
const app = express();

app.set('view engine', 'pug');
app.set('views', 'src/views');

app.use(express.json());

// Home page (client) as static HTML, CSS, js
app.use(express.static('public'));

// Uploaded media files
app.use('/media', express.static('media'));

// Api documentation with pug
app.get('/api', (req, res) => {
  res.render('index', {
    title: 'API documentation',
    message: 'TODO: include docs here!',
    exampleData: mediaItems
  });
});

// /api/media resource endpoints
app.get('/api/media', (req, res) => {
  getItems(res);
});

app.get('/api/users', (req, res) => {
  getUsers(res);
});

app.get('/api/media/:id', (req, res) => {
  console.log('query params:', req.query);
  console.log('req.query:', req.params);
  getItemById(req, res);
});

app.get('/api/users/:id', (req, res) => {
  getUserById(req, res);
});

app.post('/api/media', (req, res) => {
  postItem(req, res);
});

app.post('/api/users', (req, res) => {
  postUser(req, res);
});

// updating an item
app.put('/api/media/:id', (req, res) => {
  const id = parseInt(req.params.id);
  putItem(id, req, res);
});

// updating an user
app.put('/api/users/:id', (req, res) => {
  const id = parseInt(req.params.id);
  putUser(id, req, res);
});

app.put('/api/media', (req, res) => {
  // TODO: implement this endpoint
  res.status(501).json({message: 'Under construction'});
});

// deleting an item
app.delete('/api/media/:id', (req, res) => {
  const id = parseInt(req.params.id);
  deleteItem(id, res);
});

// deleting an user
app.delete('/api/users/:id', (req, res) => {
  const id = parseInt(req.params.id);
  deleteUser(id, res);
});

app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
