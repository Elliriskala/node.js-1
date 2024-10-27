// mock data
const items = [
  {id: 1, name: 'Grape'},
  {id: 2, name: 'Apple'},
  {id: 3, name: 'Kiwi'},
  {id: 4, name: 'Banana'},
];

const hostname = '127.0.0.1';
const port = 3000;

// Get all items
const getItems = (req, res) => {
  const url = new URL(req.url, `http://${hostname}:${port}`);
  const sortItems = url.searchParams.get('sortItems');

  let result = [...items];

  // sorting the items in an alphabetical order, (/items?sortItems=name)
  if (sortItems === 'name') {
    result.sort((a, b) => a.name.localeCompare(b.name));
  }

  res.writeHead(200, {'Content-Type': 'application/json'});
  res.end(JSON.stringify(result));
};

// Get item by id
const getItemId = (id, res) => {
  const item = items.find((i) => i.id === id);
  if (item) {
    res.writeHead(200, {'Content-Type': 'application/json'});
    res.end(JSON.stringify(item));
  } else {
    res.writeHead(404, {'Content-Type': 'application/json'});
    res.end(JSON.stringify({error: 'Item not found'}));
  }
};

// add a new item
const postItem = (req, res) => {
  let body = [];
  req
    .on('data', (chunk) => {
      body.push(chunk);
    })
    .on('end', () => {
      body = Buffer.concat(body).toString();
      // at this point, `body` has the entire request body stored in it as a string
      console.log('req body:', body);
      const newItem = JSON.parse(body);

      // find largest id in array and increment by 1
      const maxId =
        items.length > 0 ? Math.max(...items.map((item) => item.id)) : 0;
      newItem.id = maxId + 1;

      items.push(newItem);
      res.writeHead(201, {'Content-Type': 'application/json'});
      res.end(JSON.stringify({message: 'Item added'}));
    });
};

// delete an item by id
const deleteItem = (id, res) => {
  const index = items.findIndex((i) => i.id === id);
  if (index !== -1) {
    items.splice(index, 1);
    res.writeHead(204, {'Content-Type': 'application/json'});
    res.end();
  } else {
    res.writeHead(404, {'Content-Type': 'application/json'});
    res.end(JSON.stringify({error: '404', message: 'Item not found'}));
  }
};

// update an item by id
const putItem = (id, req, res) => {
  let body = [];
  req
    .on('data', (chunk) => {
      body.push(chunk);
    })
    .on('end', () => {
      body = Buffer.concat(body).toString();
      const update = JSON.parse(body);

      const index = items.findIndex((i) => i.id === id);
      if (index !== -1) {
        items[index] = {id, ...update};
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end(JSON.stringify(items[index]));
      } else {
        res.writeHead(404, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({error: '404', message: 'Item not found'}));
      }
    });
};

export {getItems, postItem, getItemId, deleteItem, putItem};
