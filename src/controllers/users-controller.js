import {
  fetchUsers,
  fetchUserById,
  addUser,
  updateUser,
  deleteUser,
} from '../models/users-model.js';

// Get all users
const getUsers = async (req, res) => {
  try {
    res.json(await fetchUsers());
  } catch (error) {
    console.error('getUsers', error.message);
    res.status(503).json({error: 503, message: 'Database error'});
  }
};

// Get user by id
const getUserById = async (req, res) => {
  const id = parseInt(req.params.id);
  console.log('getUserById', id);
  try {
    const user = await fetchUserById(id);
    if (!user) {
      res.status(404).json({error: 404, message: 'User not found'});
    } else {
      return res.json(user);
    }
  } catch (error) {
    console.error('getUserById', error.message);
    res.status(503).json({error: 503, message: 'Database error'});
  }
};

// Add a new user
const postUser = async (req, res) => {
  console.log('post req body', req.body);
  const newUser = {
    username: req.body.username,
    password: req.body.password,
    email: req.body.email,
    user_level_id: req.body.user_level_id,
    created_at: new Date(),
  };
  try {
    const id = await addUser(newUser);
    if (!id) {
      return res
        .status(400)
        .json({message: 'Something went wrong. User not added'});
    }
    res.status(201).json({message: 'User added', id: id});
  } catch (error) {
    console.error('postUser', error.message);
    res.status(503).json({error: 503, message: 'Database error'});
  }
};

// Update user by id
const putUser = async (req, res) => {
  const id = req.params.id;

  const user = {
    username: req.body.username,
    password: req.body.password,
    email: req.body.email,
    user_level_id: req.body.user_level_id,
  };
  try {
    const updateResult = await updateUser(id, user);
    if (!updateResult) {
      return res
        .status(404)
        .json({message: 'Something went wrong. User not updated'});
    }
    res.status(200).json({message: 'User updated', id: id});
  } catch (error) {
    console.error('putUser', error.message);
    res.status(503).json({error: 503, message: 'Database error'});
  }
};

// delete user by id
const removeUser = async (req, res) => {
  const id = req.params.id;
  try {
    const deleteResult = await deleteUser(id);
    if (!deleteResult) {
      return res
        .status(404)
        .json({message: 'Something went wrong. User not deleted'});
    }
    res.status(200).json({message: 'User deleted', id: id});
  } catch (error) {
    console.error('deleteUser', error.message);
    res.status(503).json({error: 503, message: 'Database error'});
  }
}

export {getUsers, getUserById, postUser, putUser, removeUser};
