import express from 'express';
import {body} from 'express-validator';
import {postLogin, getMe} from '../controllers/auth-controller.js';
import {authenticateToken} from '../middlewares/authentication.js';
import {postUser} from '../controllers/users-controller.js';

const authRouter = express.Router();

authRouter.route('/login').post(postLogin);
authRouter.route('/me').get(authenticateToken, getMe);
authRouter
  .route('/register')
  .post(
    body('username').trim().isAlphanumeric().isLength({min: 3, max: 20}),
    body('password').isLength({min: 8}),
    body('email').isEmail(),
    postUser,
  );

export default authRouter;
