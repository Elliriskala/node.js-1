// mock data
const mediaItems =[
  {
    "media_id": 9632,
    "filename": "ffd8.jpg",
    "filesize": 887574,
    "title": "Favorite drink",
    "description": "",
    "user_id": 1606,
    "media_type": "image/jpeg",
    "created_at": "2023-10-16T19:00:09.000Z"
  },
  {
    "media_id": 9626,
    "filename": "dbbd.jpg",
    "filesize": 60703,
    "title": "Miika",
    "description": "My Photo",
    "user_id": 3671,
    "media_type": "image/jpeg",
    "created_at": "2023-10-13T12:14:26.000Z"
  },
  {
    "media_id": 9625,
    "filename": "2f9b.jpg",
    "filesize": 30635,
    "title": "Aksux",
    "description": "friends",
    "user_id": 260,
    "media_type": "image/jpeg",
    "created_at": "2023-10-12T20:03:08.000Z"
  },
  {
    "media_id": 9592,
    "filename": "f504.jpg",
    "filesize": 48975,
    "title": "Desert",
    "description": "",
    "user_id": 3609,
    "media_type": "image/jpeg",
    "created_at": "2023-10-12T06:59:05.000Z"
  },
  {
    "media_id": 9590,
    "filename": "60ac.jpg",
    "filesize": 23829,
    "title": "Basement",
    "description": "Light setup in basement",
    "user_id": 305,
    "media_type": "image/jpeg",
    "created_at": "2023-10-12T06:56:41.000Z"
  }
]

// Get all items
const getItems = (res) => {
  res.json(mediaItems);
};

const postItem = (req, res) => {
  console.log('post req body:', req.body);
  const newItem = req.body;
  newItem.media_id = mediaItems[mediaItems.length - 1].media_id + 1;
  mediaItems.push(newItem);
  res.status(201).json({message: 'Item added', id: newItem.media_id});
};

// Get item by id
const getItemById = (req, res) => {
  const id = parseInt(req.params.id);
  const item = mediaItems.find((item) => item.media_id === id);
  if (item) {
    if (req.query.format === 'plain') {
      res.send(item.title);
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
  const index = mediaItems.findIndex((i) => i.id === id);
  if (index !== -1) {
    mediaItems.splice(index, 1);
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

      const index = mediaItems.findIndex((i) => i.id === id);
      if (index !== -1) {
        mediaItems[index] = {id, ...update};
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end(JSON.stringify(mediaItems[index]));
      } else {
        res.writeHead(404, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({error: '404', message: 'Item not found'}));
      }
    });
};

export {getItems, postItem, getItemById, deleteItem, putItem};
