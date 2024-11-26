import express from 'express';
import {body} from 'express-validator';
import multer from 'multer';
import {
  getUsers,
  getUserById,
  postUser,
  putUser,
  removeUser,
} from '../controllers/users-controller.js';
import {authenticateToken} from '../middlewares/authentication.js';
import { validationErrorHandler } from '../middlewares/error-handlers.js';

const upload = multer({dest: 'uploads/'});

const usersRouter = express.Router();

// /api/users resource endpoints

// get all users // add a new user

usersRouter.route('/').get(getUsers).post(upload.none(), postUser);

// get user by id // update user by id

usersRouter
  .route('/:id')
  .get(getUserById)
  .put(
    authenticateToken,
    body('username').trim().isAlphanumeric().isLength({min: 3, max: 20}),
    body('password').isString().isLength({min: 8}),
    body('email').isEmail(),
    upload.none(),
    validationErrorHandler,
    putUser,
  )
  .delete(authenticateToken, removeUser);

export default usersRouter;

/*

.route('/')
  .get(getItems)
  .post(upload.single('file'), postItem);

mediaRouter.get('/api/users', (req, res) => {
  getUsers(res);
});

mediaRouter.get('/api/users/:id', (req, res) => {
  getUserById(req, res);
});

app.post('/api/users', (req, res) => {
  postUser(req, res);
});


// updating an user
app.put('/api/users/:id', (req, res) => {
  const id = parseInt(req.params.id);
  putUser(id, req, res);
});

app.put('/api/media', (req, res) => {
  // TODO: implement this endpoint
  res.status(501).json({message: 'Under construction'});
});


// deleting an user
app.delete('/api/users/:id', (req, res) => {
  const id = parseInt(req.params.id);
  deleteUser(id, res);
});

*/
