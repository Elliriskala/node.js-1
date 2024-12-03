import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import {selectUserByUsername, fetchUserById} from '../models/users-model.js';
import 'dotenv/config';
import { customError } from '../middlewares/error-handlers.js';

/**
 * Controller for login requests
 * @param {object} req request object
 * @param {object} res response object
 * @param {function} next Express next function
 * @returns 
 */

const postLogin = async (req, res, next) => {
  console.log('postLogin', req.body);
  const {username, password} = req.body;
  const user = await selectUserByUsername(username);

  if (!user) {
    return next(customError('Invalid username', 401));
  }
  const matchPasswords = await bcrypt.compare(password, user.password)
  if (matchPasswords) {
    const token = jwt.sign({user_id: user.user_id}, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });
    // do not return password in response
    delete user.password;
    res.json({...user, token});
  } else {
    return next(customError('Invalid password', 401));
  }
};

const getMe = async (req, res, next) => {
  try {
    const user = await fetchUserById(req.user.user_id);
    res.json({user_id: req.user.user_id, ...user});
  } catch (error) {
    console.error('getMe', error.message);
    next(customError(error.message, 503));
  }
};

export {postLogin, getMe};
