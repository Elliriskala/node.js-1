// mock data
const items = [
  {id: 1, name: 'Grape'},
  {id: 2, name: 'Apple'},
  {id: 3, name: 'Kiwi'},
  {id: 4, name: 'Banana'},
];

// Get all items
const getItems = (res) => {
  res.json(items);
};

const postItem = (req, res) => {
  console.log('post req body:', req.body);
  const newItem = req.body;
  newItem.id = items[items.length - 1].id + 1;
  items.push(newItem);
  res.status(201).json({message: 'Item added', id: newItem.id});
};

// Get item by id
const getItemById = (req, res) => {
  const id = parseInt(req.params.id);
  const item = items.find((item) => item.id === id);
  if (item) {
    if (req.query.format === 'plain') {
      res.send(item.name);
      return;
    } else {
      res.json(item);
    }
  } else {
    res.status(404).json({message: 'item not found'});
  }
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

export {getItems, postItem, getItemById, deleteItem, putItem};
