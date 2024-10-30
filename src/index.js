import express from 'express';
import {getItems, postItem, getItemById} from './media.js';
const hostname = '127.0.0.1';
const port = 3000;
const app = express();

app.use(express.json());

// /api/items resource endpoints
app.get('/api/media', (req, res) => {
  getItems(res);
});

app.get('/api/media/:id', (req, res) => {
  console.log('query params:', req.query);
  console.log('req.query:', req.params);
  getItemById(req, res);
});

app.post('/api/media', (req, res) => {
  postItem(req, res);
});

app.put('/api/media', (req, res) => {
  // TODO: implement this endpoint
  res.status(501).json({message: 'Under construction'});
});

app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
