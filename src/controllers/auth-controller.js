import jwt from 'jsonwebtoken';
import {selectUserByUsernameAndPassword, fetchUserById} from '../models/users-model.js';
import 'dotenv/config';

const postLogin = async (req, res) => {
  console.log('postLogin', req.body);
  const {username, password} = req.body;
  const user = await selectUserByUsernameAndPassword(username, password);
  if (user) {
    const token = jwt.sign({user_id: user.user_id}, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });
    res.json({...user, token});
  } else {
    res.sendStatus(401);
  }
};

const getMe = async (req, res) => {
  try {
    const user = await fetchUserById(req.user.user_id);
    res.json({user_id: req.user.user_id, ...user});
  } catch (error) {
    console.error('getMe', error.message);
    res.status(503).json({error: 503, message: error.message});
  }
};

export {postLogin, getMe};
