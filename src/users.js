const users = [
  {
    user_id: 260,
    username: 'VCHar',
    password: '********',
    email: 'vchar@example.com',
    user_level_id: 1,
    created_at: '2020-09-12T06:56:41.000Z',
  },
  {
    user_id: 305,
    username: 'Donatello',
    password: '********',
    email: 'dona@example.com',
    user_level_id: 1,
    created_at: '2021-12-11T06:00:41.000Z',
  },
  {
    user_id: 3609,
    username: 'Anon5468',
    password: '********',
    email: 'x58df@example.com',
    user_level_id: 3,
    created_at: '2023-04-02T05:56:41.000Z',
  },
];

// Get all users
const getUsers = (res) => {
  res.json(users);
};

// get user by id
const getUserById = (req, res) => {
  const id = parseInt(req.params.id);
  const user = users.find((user) => user.user_id === id);
  if (user) {
    res.json(user);
  } else {
    res.status(404).json({message: 'user not found'});
  }
};

// Add a new user
const postUser = (req, res) => {
  console.log('post req body:', req.body);
  const newUser = req.body;
  newUser.user_id = users[users.length - 1].user_id + 1;
  users.push(newUser);
  res.status(201).json({message: 'User added', id: newUser.user_id});
};

// delete an user by id
const deleteUser = (user_id, res) => {
  const index = users.findIndex((i) => i.user_id === user_id);
  if (index !== -1) {
    users.splice(index, 1);
    res.status(204).end();
  } else {
    res.status(404).json({message: 'item not found'});
  }
};

// update an user by id
const putUser = (user_id, req, res) => {
  const update = req.body;
  const index = users.findIndex((i) => i.user_id === user_id);

  if (index !== -1) {
    users[index] = { ...users[index], ...update};
    res.status(200).json(users[index]);
  } else {
    res.status(404).json({message: 'item not found'});
  }
};

export {getUsers, getUserById, postUser, deleteUser, putUser, users};
