import bcrypt from 'bcryptjs';
import {
  fetchUsers,
  fetchUserById,
  addUser,
  updateUser,
  deleteUser,
} from '../models/users-model.js';
import {customError} from '../middlewares/error-handlers.js';

// Get all users
const getUsers = async (req, res, next) => {
  try {
    res.json(await fetchUsers());
  } catch (error) {
   return next(customError(error.message, 503));
  }
};

// Get user by id
const getUserById = async (req, res, next) => {
  const id = parseInt(req.params.id);
  console.log('getUserById', id);
  try {
    const user = await fetchUserById(id);
    if (!user) {
      return next(customError('User not found', 404));
    } else {
      return res.json(user);
    }
  } catch (error) {
    return next(customError(error.message, 503));
  }
};

// Add a new user
const postUser = async (req, res, next) => {
  const user = req.body;
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(user.password, salt);
  console.log('hash', hashedPassword);
  user.password = hashedPassword;
  try {
    const id = await addUser(req.body);
    res.status(201).json({message: 'New user added', id: id});

  } catch (error) {
    return next(customError(error.message, 503));
  }
};

// Update user by id
const putUser = async (req, res, next) => {
  const id = parseInt(req.params.id);

  const loggedInUser = req.user.user_id;
  
  if (id !== loggedInUser) {
    return next(customError('Forbidden: You can only update your own user details', 403));
  }

  const user = {
    username: req.body.username,
    password: req.body.password,
    email: req.body.email,
  };

  try {
    const updateResult = await updateUser(id, user);
    if (!updateResult) {
      return next(customError('User not found', 404));
    } else {
      return res.status(200).json({message: 'User updated successfully', id: id});
    }
  } catch (error) {
    return next(customError(error.message, 503));
  }
};

// delete user by id
const removeUser = async (req, res, next) => {
  const id = parseInt(req.params.id);
  const loggedInUser = req.user.user_id;

  if (id !== loggedInUser) {
    return next(customError('Forbidden: You can only delete your own user', 403));
  }
  
  try {
    const deleteResult = await deleteUser(id);
    if (!deleteResult) {
      return next(customError('User not found', 404));
    }
    res.status(200).json({message: 'User deleted', id: id});
  } catch (error) {
    console.error('deleteUser', error.message);
    return next(customError(error.message, 503));
  }
}

export {getUsers, getUserById, postUser, putUser, removeUser};
