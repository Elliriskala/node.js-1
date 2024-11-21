import express from 'express';
import multer from 'multer';
import {
  getComments,
  getCommentById,
  getCommentByUserId,
  postComment,
  putComment,
  removeComment,
} from '../controllers/comments-controller.js';
import {authenticateToken} from '../middlewares/authentication.js';

const upload = multer({dest: 'uploads/'});

const commentsRouter = express.Router();

// /api/comments resource endpoints

// get all comments // add a new comment
commentsRouter.route('/').get(getComments).post(authenticateToken, upload.none(), postComment);

// get comment by user id
commentsRouter.route('/users/:id').get(getCommentByUserId);

// get comment by id // update comment by id
commentsRouter
  .route('/:id')
  .get(getCommentById)
  .put(authenticateToken, upload.none(), putComment)
  .delete(authenticateToken, removeComment);

export default commentsRouter;
