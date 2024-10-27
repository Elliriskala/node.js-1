import http from 'http';
import {getItems, postItem, getItemId, deleteItem, putItem} from './items.js';
const hostname = '127.0.0.1';
const port = 3000;

// create a server object and bind callback function to all request events
const server = http.createServer((req, res) => {
  const {method, url} = req;
  const path = url.split('?')[0]; // get path without query string
  const id = parseInt(path.split('/')[2]);

  console.log('method:', method, 'url:', url);

  // getting all items
  if (path === '/items' && method === 'GET') {
    getItems(req, res);

  // adding a new item
  } else if (path === '/items' && method === 'POST') {
    postItem(req, res);

  // getting specific item by ID
  } else if (path.startsWith('/items/') && method === 'GET') {
    getItemId(id, res);

  // deleting an item by ID
  } else if (path.startsWith('/items/') && method === 'DELETE') {
    deleteItem(id, res);

  // updating an item by ID
  } else if (path.startsWith('/items/') && method === 'PUT') {
    putItem(id, req, res);

  // error handling
  } else {
    // generic not found response
    res.writeHead(404, {'Content-Type': 'application/json'});
    res.end(JSON.stringify({error: '404', message: 'not found'}));
  }
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
